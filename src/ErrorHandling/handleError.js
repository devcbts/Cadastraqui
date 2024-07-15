import Swal from 'sweetalert2';

export const handleAuthError = (error, navigate, message) => {
  if (error.response.status === 401) {
    // Informa o usuário
    Swal.fire({
      title: 'Sessão expirada!',
      text: 'Por favor, faça login novamente.',
      icon: 'warning',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redireciona para a página de login
        navigate('/login')
      }
    });
  }
  if (error.response.status === 400) {
    // Informa o usuário
    Swal.fire({
      title: 'Erro ao realizar ação!',
      text: 'Por favor, verifique se todos os campos estão preenchidos.',
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then((result) => {

    });
  }
  if (error.response.status === 404) {
    // Informa o usuário
    Swal.fire({
      title: 'Erro ao realizar ação!',
      text: message || 'Por favor, verifique se todos os campos estão preenchidos.',
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then((result) => {

    });
  }
  if (error.response.status === 500) {
    Swal.fire({
      title: 'Erro ao carregar Informações!',
      text: 'Por favor, verfique sua conexão com a internet. Ou tente realizar o login novamente.',
      icon: 'warning',
      confirmButtonText: 'Ok'
    }).then((result) => {

    });
  }
  else {
    // Trata outros tipos de erros aqui, se necessário
    Swal.fire({
      title: 'Erro!',
      text: message || 'Aconteceu algum erro, tente novamente ou verifique as informações inseridas.',
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then((result) => {

    });
    ;
  }
};
