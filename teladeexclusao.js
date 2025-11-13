const EMAIL_DESTINO = "contato@itup.com";

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
    confirmation: () => fields.confirmation.checked
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

    const isValid = validateForm();
    if (!isValid) {
        updateSubmitState();
        return;
    }

    const payload = buildPayload();
    triggerMailto(payload);
    showToast();
    form.reset();
    updateSubmitState();
});

function validateField(fieldId) {
    if (!(fieldId in validators)) return true;
    const field = fields[fieldId];
    const value = field.type === "checkbox" ? field.checked : field.value;
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
    const ready = validateForm();
    submitBtn.disabled = !ready;
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
    window.location.href = `mailto:${EMAIL_DESTINO}?subject=${subject}&body=${encodedBody}`;
}

function showToast() {
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 4000);
}

// Inicializa estado do botão
updateSubmitState();
