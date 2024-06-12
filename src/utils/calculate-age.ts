
export function calculateAge(birthDate: Date){
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Se o mês atual for menor que o mês de nascimento,
    // ou se estivermos no mês de nascimento mas o dia atual ainda não passou,
    // então a pessoa ainda não fez aniversário este ano.
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}