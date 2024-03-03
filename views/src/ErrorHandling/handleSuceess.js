import Swal from 'sweetalert2';

export const handleSuccess = (response, message) => {
  if (response.status === 201) {
    // Informa o usuário sobre o sucesso da ação
    Swal.fire({
      title: 'Sucesso!',
      text: message || 'Ação realizada com sucesso.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }
  // Aqui, você pode adicionar tratamentos para outros códigos de status de sucesso, se necessário
};
