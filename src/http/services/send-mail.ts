import nodemailer from 'nodemailer'

export async function sendMail(token: string) {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'be748dd7c7d790',
      pass: '69d282cae9f3f6',
    },
  })

  // Envia o Email de redefinição de senha
  const info = await transport.sendMail({
    from: 'kauanaragao50@gmail.com',
    to: 'kauanaragao50@gmail.com',
    subject: 'Reset Password',
    text: 'Token to Reset your Password',
    html: `<body>
    <h1>Recuperação de senha</h1>
    <p>Prezado(a), esse e-mail é automatico então, não responda.</p>
    <p>Esqueceu a senha ? Não se preocupe, utilize esse  <b>token: ${token}</b> </p>
  
    <h2>Sobre o Token</h2>
    <p> - O token tem um prazo de <b>1 hora</b> para ser utilizado. Sendo ultrapassado, será necessário fazer uma nova solicitação.</p>
    <p> - Para alterar a senha insira o token recebido no campo código no formulário.</p>
    <div>Clique no link para ser redirecionado para a página de mudança de senha: <a href="http://localhost:3000/reset_password?token=${token}">Resetar Senha</a> </div>
  </body>`,
  })

  const messageId = info.messageId

  return { messageId }
}
