import speakeasy from "speakeasy";

export module TOTP {
  export function generateSecret() {
    const { otpauth_url, base32 } = speakeasy.generateSecret({
      name: "EntE",
    });

    return { qrcode_url: otpauth_url, secret: base32 };
  }

  export function verifyToken(secret: string, token: string) {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
  }
}
