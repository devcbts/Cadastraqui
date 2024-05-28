import React, { useState } from 'react';

export default function DeclarationData({ onSave, onEdit, initialData }) {
    const [formData, setFormData] = useState(initialData || {
        declarationType: '', // Tipo de declaração
        content: '' // Conteúdo da declaração
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.declarationType) {
            tempErrors.declarationType = 'Tipo de declaração é obrigatório';
        }
        if (!formData.content) {
            tempErrors.content = 'Conteúdo da declaração é obrigatório';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (initialData) {
                onEdit(formData);
            } else {
                onSave(formData);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="declarationType">Tipo de Declaração:</label>
                <select name="declarationType" value={formData.declarationType} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    <option value="identity">Identidade</option>
                    <option value="residence">Residência</option>
                    <option value="income">Rendimento</option>
                </select>
                {errors.declarationType && <p>{errors.declarationType}</p>}
            </div>
            <div>
                <label htmlFor="content">Conteúdo da Declaração:</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required />
                {errors.content && <p>{errors.content}</p>}
            </div>
            <button type="submit">{initialData ? 'Editar' : 'Salvar'}</button>
        </form>
    );
}
