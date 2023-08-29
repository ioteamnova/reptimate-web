import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config = {
    client_id: "store.reptimate.web", // This is the service ID we created.
    redirect_uri: "https://web.reptimate.store:3000/api/applelogin/callback", // As registered along with our service ID
    response_type: "code id_token",
    state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
    scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
    response_mode: "form_post",
    m: 11,
    v: "1.5.4",
  };
  const queryString = Object.entries(config).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  const url = `https://appleid.apple.com/auth/authorize?${queryString}`
  if (req.method === "POST") {
    res.redirect(307, url);
  } else {
    res.redirect(307, "https://localhost:3000");
  }
}