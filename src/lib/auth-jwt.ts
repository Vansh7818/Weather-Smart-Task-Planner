import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "weather-smart-planner-secret-key-12345";
const key = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
}

export async function signJWT(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  return await verifyJWT(token);
}
