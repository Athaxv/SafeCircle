"use client"
import React, { useEffect } from 'react'

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: { configUrl: string }) => void;
    };
  }
}

function BotPress() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.botpress.cloud/webchat/v2/inject.js";
        script.async = true;
        document.body.appendChild(script);
    
        script.onload = () => {
          window.botpressWebChat.init({
            configUrl: "https://files.bpcontent.cloud/2025/04/17/09/20250417091701-ABCK93RJ.json",
            // 'botName': "SafeCircle Assistant",
            // hideWidget: false,
            // showCloseButton: true,
            // enableReset: true,
          });
        };
      }, []);
  return (
    <div>
    </div>
  )
}

export default BotPress