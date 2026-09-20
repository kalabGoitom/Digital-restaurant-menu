import crypto from "crypto";

const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generateInvitationCode = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "NOVA-";

  for (let i = 0; i < 10; i++) {
    if (i === 4) {
      code += "-";
    }

    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters[randomIndex];
  }

  return code;
};

const hashInvitationValue = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export { generateInvitationToken, generateInvitationCode, hashInvitationValue };
