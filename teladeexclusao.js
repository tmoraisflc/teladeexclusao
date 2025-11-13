// Elementos do DOM
const deleteForm = document.getElementById('deleteForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmationCheckbox = document.getElementById('confirmation');
const deleteBtn = document.getElementById('deleteBtn');
const confirmModal = document.getElementById('confirmModal');
const loadingModal = document.getElementById('loadingModal');

// Mensagens de erro
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmationError = document.getElementById('confirmationError');

// Estado do formulário
let formState = {
    emailValid: false,
    passwordValid: false,
    confirmationValid: false
};

// Email de referência (simula email da conta logada)
const userEmail = 'usuario@exemplo.com';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateDeleteButtonState();
});

// Configurar event listeners
function setupEventListeners() {
    // Validação em tempo real do email
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    
    // Validação em tempo real da senha
    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Validação do checkbox
    confirmationCheckbox.addEventListener('change', validateConfirmation);
    
    // Submit do formulário
    deleteForm.addEventListener('submit', handleFormSubmit);
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Click fora do modal para fechar
    confirmModal.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            closeModal();
        }
    });
}

// Validação do email
function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    clearError(emailError);
    
    if (!email) {
        showError(emailError, 'Email é obrigatório');
        formState.emailValid = false;
    } else if (!emailRegex.test(email)) {
        showError(emailError, 'Formato de email inválido');
        formState.emailValid = false;
    } else if (email !== userEmail) {
        showError(emailError, 'Email não corresponde à conta atual');
        formState.emailValid = false;
    } else {
        formState.emailValid = true;
        emailInput.style.borderColor = '#28a745';
    }
    
    updateDeleteButtonState();
}

// Validação da senha
function validatePassword() {
    const password = passwordInput.value;
    
    clearError(passwordError);
    
    if (!password) {
        showError(passwordError, 'Senha é obrigatória');
        formState.passwordValid = false;
    } else if (password.length < 6) {
        showError(passwordError, 'Senha deve ter pelo menos 6 caracteres');
        formState.passwordValid = false;
    } else {
        formState.passwordValid = true;
        passwordInput.style.borderColor = '#28a745';
    }
    
    updateDeleteButtonState();
}

// Validação do checkbox de confirmação
function validateConfirmation() {
    clearError(confirmationError);
    
    if (!confirmationCheckbox.checked) {
        showError(confirmationError, 'Você deve confirmar que entende a ação');
        formState.confirmationValid = false;
    } else {
        formState.confirmationValid = true;
    }
    
    updateDeleteButtonState();
}

// Mostrar erro
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Limpar erro
function clearError(errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Atualizar estado do botão de exclusão
function updateDeleteButtonState() {
    const allValid = formState.emailValid && formState.passwordValid && formState.confirmationValid;
    
    deleteBtn.disabled = !allValid;
    
    if (allValid) {
        deleteBtn.style.opacity = '1';
        deleteBtn.style.cursor = 'pointer';
    } else {
        deleteBtn.style.opacity = '0.6';
        deleteBtn.style.cursor = 'not-allowed';
    }
}

// Toggle visibilidade da senha
function togglePassword() {
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}

// Lidar com submit do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar tudo novamente
    validateEmail();
    validatePassword();
    validateConfirmation();
    
    // Se tudo válido, mostrar modal de confirmação
    if (formState.emailValid && formState.passwordValid && formState.confirmationValid) {
        showConfirmModal();
    }
}

// Mostrar modal de confirmação
function showConfirmModal() {
    confirmModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focar no botão de cancelar
    setTimeout(() => {
        const cancelBtn = confirmModal.querySelector('.btn-secondary');
        if (cancelBtn) cancelBtn.focus();
    }, 100);
}

// Fechar modal
function closeModal() {
    confirmModal.style.display = 'none';
    loadingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Confirmar exclusão
function confirmDeletion() {
    closeModal();
    showLoadingModal();
    
    // Simular processo de exclusão
    setTimeout(() => {
        // Aqui você faria a chamada real para a API
        simulateAccountDeletion();
    }, 2000);
}

// Mostrar modal de loading
function showLoadingModal() {
    loadingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Simular exclusão da conta
function simulateAccountDeletion() {
    // Em um cenário real, aqui você faria:
    // - Chamada para API de exclusão
    // - Logout do usuário
    // - Redirecionamento para página de confirmação
    
    closeModal();
    
    // Mostrar mensagem de sucesso
    showSuccessMessage();
}

// Mostrar mensagem de sucesso
function showSuccessMessage() {
    // Substituir o conteúdo da página pela confirmação
    document.querySelector('.main-content').innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1>Conta Excluída com Sucesso</h1>
            <p class="success-message">
                Sua conta foi permanentemente removida de nossos sistemas. 
                Obrigado por ter sido parte da nossa comunidade.
            </p>
            <div class="success-actions">
                <a href="#" class="btn-primary" onclick="redirectToHome()">
                    <i class="fas fa-home"></i>
                    Ir para Página Inicial
                </a>
            </div>
        </div>
    `;
    
    // Adicionar estilos para o sucesso
    addSuccessStyles();
}

// Adicionar estilos para a página de sucesso
function addSuccessStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .success-content {
            text-align: center;
            padding: 60px 20px;
        }
        
        .success-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #28a745, #20c997);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: successPulse 2s ease-in-out;
        }
        
        .success-icon i {
            font-size: 48px;
            color: white;
        }
        
        @keyframes successPulse {
            0% {
                transform: scale(0.8);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .success-message {
            font-size: 18px;
            color: #6c757d;
            max-width: 400px;
            margin: 0 auto 40px;
            line-height: 1.6;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Voltar (simular navegação)
function goBack() {
    if (confirm('Tem certeza que deseja cancelar? Todas as informações preenchidas serão perdidas.')) {
        // Em um cenário real, isso faria:
        // window.history.back() ou redirecionamento específico
        alert('Redirecionando para a página anterior...');
    }
}

// Redirecionamento para home
function redirectToHome() {
    // Em um cenário real, redirecionaria para a página inicial
    alert('Redirecionando para a página inicial...');
}

// Utilitários para demonstração
function setDemoEmail() {
    emailInput.value = userEmail;
    validateEmail();
}

// Adicionar algumas funcionalidades extras para melhor UX
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar dica sobre o email correto
    const emailLabel = document.querySelector('label[for="email"]');
    emailLabel.innerHTML += ` <small style="color: #6c757d;">(${userEmail})</small>`;
    
    // Adicionar contador de caracteres para senha
    const passwordGroup = passwordInput.parentNode.parentNode;
    const passwordHint = document.createElement('small');
    passwordHint.style.color = '#6c757d';
    passwordHint.style.fontSize = '13px';
    passwordHint.textContent = 'Mínimo 6 caracteres';
    passwordGroup.appendChild(passwordHint);
    
    // Auto-foco no primeiro campo
    setTimeout(() => {
        emailInput.focus();
    }, 500);
});

// Prevenir submit acidental
window.addEventListener('beforeunload', function(e) {
    const hasData = emailInput.value || passwordInput.value || confirmationCheckbox.checked;
    
    if (hasData) {
        e.preventDefault();
        e.returnValue = '';
        return 'Você tem certeza que deseja sair? Todas as informações serão perdidas.';
    }
});

// Adicionar funcionalidade de teclas de atalho
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter para submeter (se habilitado)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !deleteBtn.disabled) {
        e.preventDefault();
        handleFormSubmit(e);
    }
    
    // Esc para cancelar
    if (e.key === 'Escape' && !confirmModal.style.display !== 'block') {
        goBack();
    }
});

// Log para desenvolvimento (remover em produção)
console.log('✅ Sistema de exclusão de conta inicializado');
console.log('📧 Email de demonstração:', userEmail);