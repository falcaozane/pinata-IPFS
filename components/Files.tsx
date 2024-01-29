import React, { useState, useEffect } from "react";
import axios from "axios";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

const ENCRYPTION_KEY = "your-secret-key"; // Replace with your secret key

export default function Files(props) {
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [encryptedUrl, setEncryptedUrl] = useState("");

  useEffect(() => {
    // Function to shorten the URL using the TinyURL API
    const shortenUrl = async () => {
      try {
        const response = await axios.get(
          `https://tinyurl.com/api-create.php?url=${GATEWAY_URL}/ipfs/${props.cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`
        );

        setShortenedUrl(response.data);
        // Encrypt the URL using XOR cipher
        setEncryptedUrl(encrypt(response.data, ENCRYPTION_KEY));
      } catch (error) {
        console.error("Error shortening URL:", error);
      }
    };

    // Call the function to shorten the URL when the component mounts
    shortenUrl();
  }, [props.cid]);

  const encrypt = (text, key) => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // Base64 encode for better representation
  };

  const decrypt = (text, key) => {
    const decodedText = atob(text);
    let result = "";
    for (let i = 0; i < decodedText.length; i++) {
      result += String.fromCharCode(decodedText.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };

  return (
    <div className="file-viewer">
      <div className="text-wrap">
        <p className="font-semibold ">Your IPFS CID:</p>
        <p className="text-gray-800 truncate">{props.cid}</p>
      </div>
      <a
        href={`${GATEWAY_URL}/ipfs/${props.cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`}
        rel="noopener noreferrer"
        target="_blank"
        className="border-b-2 mb-20 border-solid border-accent  text-green-950 animate-animategradient hover:scale-110 transition-all duration-300 ease-in-out"
      >
        View file
      </a>
      <div className="grid py-3">
        <label className="font-semibold text-sm mt-6">Gateway and URL:</label>
        <input className="my-2 px-4 py-3 rounded-lg " value={`${GATEWAY_URL}/ipfs/${props.cid}?pinataGatewayToken=`} />
        <label className="text-sm font-semibold mt-4">Token:</label>
        <input className="py-2 my-2 px-4 rounded-lg " value={process.env.NEXT_PUBLIC_GATEWAY_TOKEN} />
      </div>
      <label className="font-semibold text-sm">Shorten URL:</label>
      <input
        className="px-4 py-3 w-full mb-8 text-lg rounded-lg "
        type="text"
        value={shortenedUrl}
        readOnly
      />
      <label className="font-semibold text-sm">Encrypted URL:</label>
      <input
        className="px-4 py-3 w-full mb-8 text-lg rounded-lg "
        type="text"
        value={encryptedUrl}
        readOnly
      />
      <button
        onClick={() => {
          // Decrypt the URL using XOR cipher
          const decryptedUrl = decrypt(encryptedUrl, ENCRYPTION_KEY);
          window.open(decryptedUrl, "_blank");
        }}
        className="bg-secondary text-light rounded-3xl py-2 px-4 my-3 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
      >
        Decrypt and Open
      </button>
    </div>
  );
}
