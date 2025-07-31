import nodemailer from "nodemailer";

export async function sendActivationEmail({ to, activationLink }) {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_NODEMAILER,
            pass: process.env.PASSWORD_NODEMAILER
        }
    });

    let info = await transporter.sendMail({
        from: '"Twitter X Fa Kè" <no-reply@twitter_X_Fake.com>',
        to,
        subject: "Xác thực tài khoản Twitter X Fa Kè",
        html: `
        <div style="max-width:500px;margin:40px auto;padding:30px 25px;background:#fff;border-radius:12px;box-shadow:0 6px 24px 0 rgba(0,0,0,0.09);font-family:'Segoe UI',Arial,sans-serif;">
            <div style="text-align:center;margin-bottom:28px;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/X_logo.jpg" alt="Logo" style="width:54px;height:54px;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:10px;" />
                <h2 style="margin:0;font-weight:700;color:#1da1f2;">Twitter X Fa Kè</h2>
            </div>
            <h3 style="color:#333;text-align:center;font-size:22px;">Xác thực tài khoản của bạn</h3>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:22px 0 26px 0;text-align:center;">
                Cảm ơn bạn đã đăng ký tài khoản tại <b>Twitter X Fa Kè</b>.<br>
                Để hoàn tất đăng ký, vui lòng bấm vào nút bên dưới để xác thực tài khoản:
            </p>
            <div style="text-align:center;margin-bottom:25px;">
                <a href="${activationLink}" style="background:#1da1f2;color:#fff;text-decoration:none;padding:13px 34px;border-radius:6px;font-size:16px;font-weight:600;letter-spacing:0.5px;box-shadow:0 2px 8px rgba(29,161,242,0.14);display:inline-block;">
                    Xác thực tài khoản
                </a>
            </div>
            <p style="color:#666;font-size:13px;text-align:center;line-height:1.7;">
                Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.<br>
                Hoặc nếu nút không hoạt động, bạn có thể copy link sau và dán vào trình duyệt:<br>
                <a href="${activationLink}" style="color:#1da1f2;word-break:break-all;">${activationLink}</a>
            </p>
            <div style="border-top:1px solid #eee;margin-top:30px;padding-top:15px;font-size:12px;color:#bbb;text-align:center;">
                © ${new Date().getFullYear()} Twitter X Fa Kè. All rights reserved.
            </div>
        </div>
        `
    });

}
