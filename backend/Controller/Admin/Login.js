const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const AdminSchema = require('../../Modal/adminLogin');
const key="Hello"

const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await AdminSchema.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        // Verify password with migration fallback
        let isMatch = false;
        if (user.password.startsWith('$2') && user.password.length > 30) {
            // It's likely a bcrypt hash
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // It's a plain text password, compare directly
            isMatch = (password === user.password);
            
            // Auto-upgrade to hash on successful login
            if (isMatch) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();
                console.log(`✅ Admin ${email} password auto-upgraded to hash.`);
            }
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        const data = {
            id: user.id,
            role: 'admin'
        };

        // Standardizing response
        const token = jwt.sign(data, key);
        res.status(200).json({ 
            success: true, 
            token, 
            message: 'Login successful' 
        });
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error occurred' 
        });
    }
}

module.exports={AdminLogin}