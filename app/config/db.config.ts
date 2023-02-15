/** @format */

const Config: { DB: string; TOKEN_FIREBASE_DEVICES: string } = {
  DB: `${process.env.DATABASE}`,
  TOKEN_FIREBASE_DEVICES:`${process.env.TOKEN_FIREBASE_DEVICE}`,
};

export default Config;
