import jwt from 'jsonwebtoken';

export const authJwt = (req, res, next) => {
    /* Essa função verifica se a header da requisição passou o token do usuário para proteger a rota */
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ message: 'Header não contém um campo com o token' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

