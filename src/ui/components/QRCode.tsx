import { useState, useEffect } from "react";
import qrcodegen from "qrcode";

interface QRCodeProps {
  url: string;
}

export function QRCode(props: QRCodeProps) {
  const { url } = props;

  const [dataUrl, setDataUrl] = useState<string>();

  useEffect(() => {
    qrcodegen.toDataURL(url).then(setDataUrl);
  }, [url, setDataUrl]);

  if (!dataUrl) {
    return null;
  }

  return <img src={dataUrl} alt={url} />;
}
