from fastapi import FastAPI, Body, Form
from fastapi.responses import JSONResponse
import config
p12_password = '$k1pC@$H_2o22'
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import base64
import uuid
import requests
from Crypto.Hash import HMAC, SHA256
from typing import Annotated
from requests_pkcs12 import Pkcs12Adapter
app = FastAPI()

# Replace with the actual paths and password
certificate_path = './Certificates.p12'

app.mount("/static", StaticFiles(directory="static"), name="static")

def hash_hmac(algorithm, data, key, raw_output=False):
    key_bytes = key.encode('utf-8')
    data_bytes = data.encode('utf-8')
    
    if algorithm.lower() != "sha256":
        raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    hmac_obj = HMAC.new(key_bytes, msg=data_bytes, digestmod=SHA256)
    
    if raw_output:
        return hmac_obj.digest()
    else:
        return hmac_obj.hexdigest()

@app.get("/")
async def get_html():
    return FileResponse("static/index.html")

@app.get("/.well-known/apple-developer-merchantid-domain-association.txt")
async def get_text():
    return FileResponse(".well-known/apple-developer-merchantid-domain-association.txt")

@app.get("/sdk.js")
async def get_sdk():
    return FileResponse("static/sdk.js")     

@app.get("/validateSession")
async def root(u):
    if not u:
        return "Please send the url"
    data = {
        'merchantIdentifier': config.validateSession["MerchantIdentifier"],
        'domainName': config.validateSession["DomainName"],
        'displayName': config.validateSession["DisplayName"],
        'initiative': config.validateSession["Initiative"],
        'initiativeContext': config.validateSession["InitiativeContext"],
    }

    cert = Pkcs12Adapter(pkcs12_filename=certificate_path, pkcs12_password=p12_password)

    # Set up HTTP client
    client = requests.Session()
    client.mount("https://", cert)

    # Prepare JSON payload
    payload = json.dumps(data, ensure_ascii=False)

    # Prepare headers
    headers = {
        "Content-Type": "application/json"
    }

    # Make POST request
    validation_url = u  # Replace with your actual validation URL
    response = client.post(validation_url, data=payload.encode("utf-8"), headers=headers)

    response.raise_for_status()

    return json.dumps(response.json())

@app.post("/makePayment")
async def root(amount: Annotated[str, Form()]):
    try:
        if not "amount":
            return "Please send the amount"

        uid = str(uuid.uuid4())

        data = {
            "Uid": uid,
            "KeyId": config.validateSession["KeyId"],  # You need to define validate_session and populate it
            "Amount": amount,
            "FirstName": "",
            "LastName": "Gag",
            "Phone": "",
            "Email": "",
            "TransactionId": uid,
        }

        data_string = json.dumps(data)
        result_header = (
            "Uid="
            + data["Uid"]
            + ",KeyId="
            + data["KeyId"]
            + ",Amount="
            + data["Amount"]
            + ",FirstName="
            + data["FirstName"]
            + ",LastName="
            + data["LastName"]
            + ",Phone="
            + data["Phone"]
            + ",Email="
            + data["Email"]
            + ",TransactionId="
            + data["TransactionId"]
        )

        s = hash_hmac("sha256", result_header, config.validateSession["KeySecret"], True)
        authorization_header = base64.b64encode(s).decode("utf-8")

        headers = {
            "Content-Type": "application/json",
            "Authorization": authorization_header,
        }

        response = requests.post(
            config.validateSession["prodUrl"] + "/api/v1/payments",
            headers=headers,
            data=data_string,
        )

        if response.status_code == 200:
            return JSONResponse(response.json())
        else:
            return response.text
    except:
        return "SomeThing Went Wrong"
      

   