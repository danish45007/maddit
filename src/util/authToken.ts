import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface input {
  username: string;
}

export const jwtToken = {
  createToken({ username }: input) {
    return jwt.sign({ username }, process.env.JWT_SECRECT!, {
      expiresIn: "24h",
    });
  },
  verifyToken(token: any) {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRECT!);
    return decoded;
  },
};

export const hashPassword = (password: any) => bcrypt.hashSync(password, 6);
export const comparePassword = (password: any, hash: any) =>
  bcrypt.compareSync(password, hash);
