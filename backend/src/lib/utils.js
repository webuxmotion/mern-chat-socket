import jwt from "jsonwebtoken"

export const tokenKey = "jwt";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie(tokenKey, token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })

    return token
}

export const removeToken = (res) => {
    res.cookie(tokenKey, "", {maxAge: 0})
}

export const res500 = (res, message = "Internal server error") => {
    res.status(500).json({ message })
}