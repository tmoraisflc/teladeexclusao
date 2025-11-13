const EMAIL_DESTINO = "contato@itup.com.br";

const form = document.getElementById("requestForm");
const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    company: document.getElementById("company"),
    accountId: document.getElementById("accountId"),
    reason: document.getElementById("reason"),
    details: document.getElementById("details"),
    confirmation: document.getElementById("confirmation")
};

const errorMap = {
    fullName: document.getElementById("fullNameError"),
    email: document.getElementById("emailError"),
    reason: document.getElementById("reasonError"),
    details: document.getElementById("detailsError"),
    confirmation: document.getElementById("confirmationError")
};

const validators = {
    fullName: value => value.trim().length >= 3,
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    reason: value => Boolean(value),
    details: value => value.trim().length >= 15,
    confirmation: value => Boolean(value)
};

const errorMessages = {
    fullName: "Informe seu nome completo.",
    email: "Digite um e-mail válido.",
    reason: "Selecione um motivo.",
    details: "Descreva o pedido com pelo menos 15 caracteres.",
    confirmation: "Confirme que autoriza a exclusão permanente."
};

Object.values(fields).forEach(field => {
    if (!field) return;
    const event = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(event, () => {
        validateField(field.id);
        updateSubmitState();
    });
});

form.addEventListener("submit", event => {
    event.preventDefault();

    // Valida apenas os campos obrigatórios no momento do envio
    const requiredFields = ['fullName', 'email', 'reason', 'details', 'confirmation'];
    let hasErrors = false;
    
    requiredFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            hasErrors = true;
        }
    });

    if (hasErrors) {
        // Mostra mensagem de erro mais clara
        alert('Por favor, preencha todos os campos obrigatórios corretamente antes de enviar.');
        return;
    }

    const payload = buildPayload();
    triggerMailto(payload);
    showToast();
    
    // Reset do formulário após envio bem-sucedido
    setTimeout(() => {
        form.reset();
        Object.values(errorMap).forEach(el => el.textContent = "");
        Object.values(fields).forEach(field => field.classList.remove("invalid"));
        updateSubmitState();
    }, 1000);
});

function validateField(fieldId) {
    if (!(fieldId in validators)) return true;
    const field = fields[fieldId];
    const value = getFieldValue(field);
    const isValid = validators[fieldId](value);

    if (!isValid) {
        errorMap[fieldId].textContent = errorMessages[fieldId];
        field.classList.add("invalid");
    } else {
        errorMap[fieldId].textContent = "";
        field.classList.remove("invalid");
    }

    return isValid;
}

function validateForm() {
    return Object.keys(validators).every(validateField);
}

function updateSubmitState() {
    const ready = isFormReady();
    submitBtn.classList.toggle("button--inactive", !ready);
}

function getFieldValue(field) {
    return field.type === "checkbox" ? field.checked : field.value;
}

function isFormReady() {
    // Validação mais permissiva - ativa o botão quando alguns campos básicos estão preenchidos
    const basicFields = ['fullName', 'email'];
    return basicFields.some(key => {
        const field = fields[key];
        const value = getFieldValue(field);
        return value && value.toString().trim().length > 0;
    });
}

function buildPayload() {
    const data = {
        "Nome": fields.fullName.value.trim(),
        "E-mail": fields.email.value.trim(),
        "Empresa": fields.company.value.trim() || "Não informado",
        "ID/Usuário": fields.accountId.value.trim() || "Não informado",
        "Motivo": fields.reason.options[fields.reason.selectedIndex].text,
        "Detalhes": fields.details.value.trim()
    };

    return Object.entries(data)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\r\n");
}

function triggerMailto(body) {
    const subject = encodeURIComponent("Solicitação de exclusão de conta");
    const encodedBody = encodeURIComponent(body + '\r\n\r\nConfirmo que autorizo a exclusão permanente da minha conta.');
    const mailtoUrl = `mailto:${EMAIL_DESTINO}?subject=${subject}&body=${encodedBody}`;
    
    try {
        // Tenta abrir o cliente de email nativo (funciona em iOS, Android, Desktop)
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Se estiver rodando localmente, usa window.location.href
            window.location.href = mailtoUrl;
        } else {
            // Para ambientes web, cria um link temporário e clica nele
            const tempLink = document.createElement('a');
            tempLink.href = mailtoUrl;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        }
    } catch (error) {
        console.error('Erro ao abrir cliente de email:', error);
        // Fallback: copia o email para a área de transferência
        copyEmailToClipboard(EMAIL_DESTINO, subject, body);
    }
}

function copyEmailToClipboard(email, subject, body) {
    const emailText = `Para: ${email}\nAssunto: ${decodeURIComponent(subject)}\n\n${decodeURIComponent(body)}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(emailText).then(() => {
            alert('Não foi possível abrir o cliente de email automaticamente. O conteúdo foi copiado para a área de transferência. Cole em seu aplicativo de email preferido.');
        }).catch(() => {
            showManualEmailInfo(email, subject, body);
        });
    } else {
        showManualEmailInfo(email, subject, body);
    }
}

function showManualEmailInfo(email, subject, body) {
    const message = `Não foi possível abrir o cliente de email automaticamente.\n\nEnvie um email para:\n${email}\n\nAssunto: ${decodeURIComponent(subject)}\n\nConteúdo:\n${decodeURIComponent(body)}`;
    alert(message);
}

function showToast() {
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 4000);
}

// Inicializa estado do botão
updateSubmitState();
