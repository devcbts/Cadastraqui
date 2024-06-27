import nodemailer from 'nodemailer';

export async function sendPasswordRecoveryMail({ token, email }: { token: string, email: string }) {
  const transport = nodemailer.createTransport({
    service: "godaddy",

    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  })

  // Envia o Email de redefinição de senha
  const info = await transport.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Recuperação de senha CADASTRAQUI',
    text: 'Token de recuperação de senha cadastraqui',
    html: `<body>
    <h1>Recuperação de senha</h1>
    <p>Prezado(a), esse e-mail é automatico então, não responda.</p>
    <p>Esqueceu a senha ? Não se preocupe, utilize esse  <b>token: ${token}</b> </p>
  
    <h2>Sobre o Token</h2>
    <p> - O token tem um prazo de <b>1 hora</b> para ser utilizado. Sendo ultrapassado, será necessário fazer uma nova solicitação.</p>
    <p> - Para alterar a senha insira o token recebido no campo código no formulário.</p>
    <div>Clique no link para ser redirecionado para a página de mudança de senha: <a href="${process.env.SITE_URL}/reset_password?token=${token}">Resetar Senha</a> </div>
  </body>`,
  })

  const messageId = info.messageId

  return { messageId }
}
