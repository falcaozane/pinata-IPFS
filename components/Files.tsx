import React, { useState, useEffect } from "react";
import axios from "axios";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

export default function Files(props) {
  const [shortenedUrl, setShortenedUrl] = useState("");

  useEffect(() => {
    // Function to shorten the URL using the TinyURL API
    const shortenUrl = async () => {
      try {
        const response = await axios.get(
          `http://tinyurl.com/api-create.php?url=${GATEWAY_URL}/ipfs/${props.cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`
        );

        setShortenedUrl(response.data);
      } catch (error) {
        console.error("Error shortening URL:", error);
      }
    };

    // Call the function to shorten the URL when the component mounts
    shortenUrl();
  }, [props.cid]);

  return (
    <div className="file-viewer">
      {/*<p>Your IPFS CID:</p>
      <p>{props.cid}</p>*/}
      <a
        href={`${GATEWAY_URL}/ipfs/${props.cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`}
        rel="noopener noreferrer"
        target="_blank"
        className="border-b-2 border-solid border-accent bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent animate-animategradient hover:scale-110 transition-all duration-300 ease-in-out"
      >
        View file
      </a>
      <input
        className="px-4 py-3 w-full my-4 text-xl rounded-xl"
        type="text"
        value={shortenedUrl}
        readOnly
      />
    </div>
  );
}
