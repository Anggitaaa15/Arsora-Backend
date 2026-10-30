
import { Request, Response } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { registerSchema, loginSchema } from "../../validations/auth.validation";
import { UserAuth } from "../../config/schema";
import { db } from "../../config/db";

// JWT SECRET
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET belum diatur di .env");
  }

  return secret;
};

export class AuthController {
  // REGISTER
  register = async (req: Request, res: Response) => {
    try {
      const secret = getJwtSecret();

      // 1. Validasi data
      const validatedData = registerSchema.parse(req.body);

      const username = validatedData.username;
      const email = validatedData.email.toLowerCase();
      const password = validatedData.password;

      // 2. Cek email
      const [existingUser] = await db
        .select({ id: UserAuth.id })
        .from(UserAuth)
        .where(eq(UserAuth.email, email))
        .limit(1);

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email sudah terdaftar",
        });
      }

      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Simpan user
      const [newUser] = await db
        .insert(UserAuth)
        .values({
          username,
          email,
          password: hashedPassword,
        })
        .returning({
          id: UserAuth.id,
          username: UserAuth.username,
          email: UserAuth.email,
          role: UserAuth.role,
        });

      // 5. Buat token JWT
      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        secret,
        { expiresIn: "1d" }
      );

      // 6. Kirim respons
      return res.status(201).json({
        success: true,
        message: "Register berhasil",
        data: {
          user: newUser,
          token,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Data registrasi tidak valid",
          errors: error.issues,
        });
      }

      // Menangani email duplikat
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        return res.status(409).json({
          success: false,
          message: "Email sudah terdaftar",
        });
      }

      console.error("Register error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat registrasi",
      });
    }
  };

  // LOGIN
  login = async (req: Request, res: Response) => {
    try {
      const secret = getJwtSecret();

      // 1. Validasi data
      const validatedData = loginSchema.parse(req.body);

      const email = validatedData.email.toLowerCase();
      const password = validatedData.password;

      // 2. Cari user
      const [user] = await db
        .select()
        .from(UserAuth)
        .where(eq(UserAuth.email, email))
        .limit(1);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      // 3. Periksa password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      // 4. Buat token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        secret,
        { expiresIn: "1d" }
      );

      // 5. Kirim respons
      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Data login tidak valid",
          errors: error.issues,
        });
      }

      console.error("Login error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat login",
      });
    }
  };

  // LOGOUT
  logout = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Logout berhasil. Silakan hapus token dari penyimpanan aplikasi.",
    });
  };
}

export default new AuthController();
