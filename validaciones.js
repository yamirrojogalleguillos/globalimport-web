const form = document.getElementById('registroForm');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');
const contadorReferencia = document.getElementById('contadorReferencia');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const fields = {
  nombre: document.getElementById('nombre'),
  fechaNacimiento: document.getElementById('fechaNacimiento'),
  rut: document.getElementById('rut'),
  genero: document.getElementById('genero'),
  nacionalidad: document.getElementById('nacionalidad'),
  email: document.getElementById('email'),
  confirmarEmail: document.getElementById('confirmarEmail'),
  password: document.getElementById('password'),
  confirmarPassword: document.getElementById('confirmarPassword'),
  telefono: document.getElementById('telefono'),
  pais: document.getElementById('pais'),
  provincia: document.getElementById('provincia'),
  ciudad: document.getElementById('ciudad'),
  calle: document.getElementById('calle'),
  codigoPostal: document.getElementById('codigoPostal'),
  referencia: document.getElementById('referencia'),
  terminos: document.getElementById('terminos'),
  privacidad: document.getElementById('privacidad')
};

const lettersRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const phoneRegex = /^[+\-\s\d]+$/;
const postalRegex = /^[a-zA-Z0-9]{4,10}$/;

function showError(fieldName, message) {
  const field = fields[fieldName];
  const error = document.getElementById(`error-${fieldName}`);

  if (field) {
    field.classList.add('campo-error');
    field.classList.remove('campo-ok');
  }

  if (error) {
    error.textContent = message;
  }
}

function showGroupError(groupName, message) {
  const error = document.getElementById(`error-${groupName}`);
  if (error) {
    error.textContent = message;
  }
}

function clearError(fieldName) {
  const field = fields[fieldName];
  const error = document.getElementById(`error-${fieldName}`);

  if (field) {
    field.classList.remove('campo-error');
    field.classList.add('campo-ok');
  }

  if (error) {
    error.textContent = '';
  }
}

function clearGroupError(groupName) {
  const error = document.getElementById(`error-${groupName}`);
  if (error) {
    error.textContent = '';
  }
}

function isAdult(dateValue) {
  if (!dateValue) {
    return false;
  }

  const birthDate = new Date(dateValue);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 18;
}

function validateRut(value) {
  const cleanValue = value.replace(/\./g, '').replace('-', '').trim().toUpperCase();

  if (!/^\d{7,8}[\dK]$/.test(cleanValue)) {
    return false;
  }

  const body = cleanValue.slice(0, -1);
  const verifier = cleanValue.slice(-1);
  let multiplier = 2;
  let sum = 0;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const result = 11 - (sum % 11);
  const expected = result === 11 ? '0' : result === 10 ? 'K' : String(result);

  return verifier === expected;
}

function validateTextField(fieldName, min, max, label) {
  const value = fields[fieldName].value.trim();

  if (!value) {
    showError(fieldName, `${label} no puede quedar vacio.`);
    return false;
  }

  if (!lettersRegex.test(value)) {
    showError(fieldName, `${label} solo puede contener letras y espacios.`);
    return false;
  }

  if (value.length < min || value.length > max) {
    showError(fieldName, `${label} debe tener entre ${min} y ${max} caracteres.`);
    return false;
  }

  clearError(fieldName);
  return true;
}

function validateRequiredSelect(fieldName, label) {
  if (!fields[fieldName].value) {
    showError(fieldName, `Selecciona una opcion para ${label}.`);
    return false;
  }

  clearError(fieldName);
  return true;
}

function validateRequiredInput(fieldName, label, min = 1) {
  const value = fields[fieldName].value.trim();

  if (!value || value.length < min) {
    showError(fieldName, `${label} debe tener al menos ${min} caracteres.`);
    return false;
  }

  clearError(fieldName);
  return true;
}

function validateField(fieldName) {
  switch (fieldName) {
    case 'nombre':
      return validateTextField('nombre', 3, 60, 'El nombre completo');
    case 'fechaNacimiento':
      if (!fields.fechaNacimiento.value || !isAdult(fields.fechaNacimiento.value)) {
        showError('fechaNacimiento', 'Debes ser mayor de 18 anos para registrarte.');
        return false;
      }
      clearError('fechaNacimiento');
      return true;
    case 'rut':
      if (!validateRut(fields.rut.value)) {
        showError('rut', 'Ingresa un Rut chileno valido con digito verificador.');
        return false;
      }
      clearError('rut');
      return true;
    case 'genero':
      return validateRequiredSelect('genero', 'genero');
    case 'nacionalidad':
      return validateRequiredSelect('nacionalidad', 'nacionalidad');
    case 'email':
      if (!emailRegex.test(fields.email.value.trim())) {
        showError('email', 'El email no tiene un formato valido.');
        return false;
      }
      clearError('email');
      return true;
    case 'confirmarEmail':
      if (fields.confirmarEmail.value.trim() !== fields.email.value.trim()) {
        showError('confirmarEmail', 'El correo debe coincidir exactamente.');
        return false;
      }
      clearError('confirmarEmail');
      return true;
    case 'password':
      if (!passwordRegex.test(fields.password.value)) {
        showError('password', 'La contrasena debe tener 8 caracteres, una mayuscula, un numero y un caracter especial.');
        return false;
      }
      clearError('password');
      return true;
    case 'confirmarPassword':
      if (fields.confirmarPassword.value !== fields.password.value) {
        showError('confirmarPassword', 'La confirmacion debe coincidir con la contrasena.');
        return false;
      }
      clearError('confirmarPassword');
      return true;
    case 'telefono': {
      const value = fields.telefono.value.trim();
      const digitCount = value.replace(/\D/g, '').length;
      if (!phoneRegex.test(value) || digitCount < 8) {
        showError('telefono', 'Ingresa un telefono valido con minimo 8 digitos.');
        return false;
      }
      clearError('telefono');
      return true;
    }
    case 'pais':
      return validateRequiredSelect('pais', 'pais');
    case 'provincia':
      return validateRequiredInput('provincia', 'Provincia / Estado', 1);
    case 'ciudad':
      return validateTextField('ciudad', 2, 60, 'La ciudad');
    case 'calle':
      return validateRequiredInput('calle', 'Calle y numero', 5);
    case 'codigoPostal':
      if (!postalRegex.test(fields.codigoPostal.value.trim())) {
        showError('codigoPostal', 'El codigo postal debe ser alfanumerico y tener entre 4 y 10 caracteres.');
        return false;
      }
      clearError('codigoPostal');
      return true;
    case 'referencia':
      if (fields.referencia.value.length > 200) {
        showError('referencia', 'La referencia no puede superar los 200 caracteres.');
        return false;
      }
      clearError('referencia');
      return true;
    case 'terminos':
      if (!fields.terminos.checked) {
        showError('terminos', 'Debes aceptar los Terminos y Condiciones.');
        return false;
      }
      clearError('terminos');
      return true;
    case 'privacidad':
      if (!fields.privacidad.checked) {
        showError('privacidad', 'Debes aceptar la Politica de Privacidad.');
        return false;
      }
      clearError('privacidad');
      return true;
    default:
      return true;
  }
}

function validateCategories() {
  const selected = document.querySelectorAll('input[name="categorias"]:checked');
  if (selected.length === 0) {
    showGroupError('categorias', 'Selecciona al menos una categoria de interes.');
    return false;
  }

  clearGroupError('categorias');
  return true;
}

function validateClientType() {
  const selected = document.querySelector('input[name="tipoCliente"]:checked');
  if (!selected) {
    showGroupError('tipoCliente', 'Selecciona un tipo de cliente.');
    return false;
  }

  clearGroupError('tipoCliente');
  return true;
}

function validateForm() {
  const requiredFields = [
    'nombre',
    'fechaNacimiento',
    'rut',
    'genero',
    'nacionalidad',
    'email',
    'confirmarEmail',
    'password',
    'confirmarPassword',
    'telefono',
    'pais',
    'provincia',
    'ciudad',
    'calle',
    'codigoPostal',
    'referencia',
    'terminos',
    'privacidad'
  ];

  const fieldsAreValid = requiredFields.map(validateField).every(Boolean);
  const categoriesAreValid = validateCategories();
  const clientTypeIsValid = validateClientType();

  return fieldsAreValid && categoriesAreValid && clientTypeIsValid;
}

Object.keys(fields).forEach((fieldName) => {
  const field = fields[fieldName];

  field.addEventListener('blur', () => validateField(fieldName));
  field.addEventListener('input', () => {
    if (field.classList.contains('campo-error')) {
      validateField(fieldName);
    }
  });
  field.addEventListener('change', () => validateField(fieldName));
});

document.querySelectorAll('input[name="categorias"]').forEach((checkbox) => {
  checkbox.addEventListener('change', validateCategories);
});

document.querySelectorAll('input[name="tipoCliente"]').forEach((radio) => {
  radio.addEventListener('change', validateClientType);
});

fields.referencia.addEventListener('input', () => {
  contadorReferencia.textContent = fields.referencia.value.length;
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    Object.keys(fields).forEach((fieldName) => {
      fields[fieldName].classList.remove('campo-error', 'campo-ok');
      const error = document.getElementById(`error-${fieldName}`);
      if (error) {
        error.textContent = '';
      }
    });
    clearGroupError('categorias');
    clearGroupError('tipoCliente');
    contadorReferencia.textContent = '0';
  }, 0);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const registeredName = fields.nombre.value.trim();
  form.hidden = true;
  successText.textContent = `${registeredName}, tu registro fue recibido correctamente. Pronto recibiras informacion comercial de GlobalImport S.A.`;
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
