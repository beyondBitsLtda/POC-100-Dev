const form = document.getElementById('poc-form');
const tabButtons = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');
const addBtn = document.getElementById('add-btn');
const viewButtons = document.querySelectorAll('[data-view]');
const viewPanels = document.querySelectorAll('[data-view-panel]');
const categoriaSelect = document.getElementById('categoriaInseguraSelect');
const subcategoriaSelect = document.getElementById('subcategoriaInseguraSelect');
const consultarBtn = document.getElementById('consultar-btn');
const consultaResultado = document.getElementById('consulta-resultado');

const basicFields = [
  document.getElementById('unidadeSelect'),
  document.getElementById('setorSelect'),
  document.getElementById('subsetorSelect'),
  document.getElementById('observador'),
  document.getElementById('data'),
  document.getElementById('hora'),
  document.getElementById('pessoas-observadas'),
  document.getElementById('pessoas-area')
];

const unsafeFields = [
  categoriaSelect,
  subcategoriaSelect,
  document.getElementById('observado'),
  document.getElementById('quantidade'),
  document.getElementById('pratica-insegura'),
  document.getElementById('acao-recomendada')
];

const safeFields = [
  document.getElementById('reconhecimento')
];

const mockResults = [
  {
    unidade: 'Unidade 01',
    setor: 'Produção',
    observador: 'Maria Souza',
    data: '2024-08-12',
    tipo: 'Prática Segura'
  },
  {
    unidade: 'Unidade 02',
    setor: 'Manutenção',
    observador: 'João Lima',
    data: '2024-08-15',
    tipo: 'Condição Insegura'
  }
];

const getSelectedType = () => {
  const checked = document.querySelector('input[name="tipo-registro"]:checked');
  return checked ? checked.value : '';
};

const getTipoInseguraSelecionado = () => {
  const checked = document.querySelector('input[name="tipoInsegura"]:checked');
  return checked ? checked.value : '';
};

const setActiveTab = (tabName) => {
  tabButtons.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.tabPanel === tabName);
  });
};

const disableTab = (tabName, disabled) => {
  const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (!tab) return;
  tab.classList.toggle('is-disabled', disabled);
  tab.setAttribute('aria-disabled', disabled ? 'true' : 'false');
};

const validateBasic = () => {
  const basicValid = basicFields.every((field) => field.value.trim() !== '' && field.checkValidity());
  const typeSelected = getSelectedType() !== '';
  return basicValid && typeSelected;
};

const validateUnsafe = () => {
  const tipoInseguraSelecionado = getTipoInseguraSelecionado() !== '';
  return tipoInseguraSelecionado
    && unsafeFields.every((field) => field.value.trim() !== '' && field.checkValidity());
};

const validateSafe = () => {
  return safeFields.every((field) => field.value.trim() !== '' && field.checkValidity());
};

const updateUI = () => {
  const basicValid = validateBasic();
  const selectedType = getSelectedType();

  if (!basicValid) {
    disableTab('inseguras', true);
    disableTab('seguras', true);
    addBtn.disabled = true;
    setActiveTab('basicos');
    return;
  }

  if (selectedType === 'insegura') {
    disableTab('inseguras', false);
    disableTab('seguras', true);
    if (document.querySelector('.tab.is-active')?.dataset.tab === 'seguras') {
      setActiveTab('basicos');
    }
  }

  if (selectedType === 'segura') {
    disableTab('inseguras', true);
    disableTab('seguras', false);
    if (document.querySelector('.tab.is-active')?.dataset.tab === 'inseguras') {
      setActiveTab('basicos');
    }
  }

  const unsafeValid = selectedType === 'insegura' && validateUnsafe();
  const safeValid = selectedType === 'segura' && validateSafe();
  addBtn.disabled = !(basicValid && (unsafeValid || safeValid));
};

const resetFormState = () => {
  form.reset();
  setActiveTab('basicos');
  disableTab('inseguras', true);
  disableTab('seguras', true);
  addBtn.disabled = true;
};

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    viewButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    const view = button.dataset.view;
    viewPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.viewPanel === view);
    });
  });
});

tabButtons.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('is-disabled')) {
      return;
    }
    setActiveTab(tab.dataset.tab);
  });
});

[...basicFields, ...unsafeFields, ...safeFields].forEach((field) => {
  field.addEventListener('input', updateUI);
  field.addEventListener('change', updateUI);
});

document.querySelectorAll('input[name="tipo-registro"]').forEach((radio) => {
  radio.addEventListener('change', updateUI);
});

document.querySelectorAll('input[name="tipoInsegura"]').forEach((radio) => {
  radio.addEventListener('change', updateUI);
});

addBtn.addEventListener('click', () => {
  if (addBtn.disabled) return;
  alert('POC adicionada com sucesso (simulação)');
  resetFormState();
});

consultarBtn.addEventListener('click', () => {
  const results = Math.random() > 0.5 ? mockResults : [];
  if (!results.length) {
    consultaResultado.textContent = 'Sem resultados (simulação)';
    return;
  }

  const table = document.createElement('table');
  table.classList.add('result-table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Unidade</th>
        <th>Setor</th>
        <th>Observador</th>
        <th>Data</th>
        <th>Tipo</th>
      </tr>
    </thead>
    <tbody>
      ${results
        .map(
          (row) => `
          <tr>
            <td>${row.unidade}</td>
            <td>${row.setor}</td>
            <td>${row.observador}</td>
            <td>${row.data}</td>
            <td>${row.tipo}</td>
          </tr>`
        )
        .join('')}
    </tbody>
  `;
  consultaResultado.innerHTML = '';
  consultaResultado.appendChild(table);
});

updateUI();


/* ===============================
 * PocAI – execução real (stub seguro)
 * =============================== */
window.PocAI = window.PocAI || {};
window.PocAI.run = async function () {
  const front = document.getElementById('pocAiFront');
  const back = document.getElementById('pocAiBack');
  const status = document.getElementById('pocAiFillStatus');
  const runBtn = document.getElementById('pocAiRun');

  if (!front?.files?.length || !back?.files?.length) {
    status.textContent = 'Selecione a frente e o verso do cartão.';
    return;
  }

  if (runBtn) {
    runBtn.disabled = true;
  }

  status.textContent = 'Enviando imagens para leitura por IA…';

  // Aqui entra o pipeline Gemini (já existente no projeto)
  // Este stub apenas confirma o fluxo correto
  setTimeout(() => {
    status.textContent = 'Imagens recebidas. Interpretando conteúdo…';
    setTimeout(() => {
      status.textContent = 'Leitura concluída. Pronto para preencher o formulário.';
      if (runBtn) {
        runBtn.disabled = false;
      }
    }, 1200);
  }, 800);
};

document.addEventListener('DOMContentLoaded', () => {
  const runBtn = document.getElementById('pocAiRun');
  const fillModalEl = document.getElementById('pocAiFillModal');
  const settingsModalEl = document.getElementById('pocAiSettingsModal');
  const fillButtons = [
    document.getElementById('poc-ai-fill-btn'),
    document.getElementById('poc-ai-fill-btn-safe')
  ];
  const settingsButtons = [
    document.getElementById('poc-ai-settings-btn'),
    document.getElementById('poc-ai-settings-btn-safe')
  ];
  const frontInput = document.getElementById('pocAiFront');
  const backInput = document.getElementById('pocAiBack');
  const modeCameraBtn = document.getElementById('pocAiModeCamera');
  const modeGalleryBtn = document.getElementById('pocAiModeGallery');
  const modeStatus = document.getElementById('pocAiFillStatus');

  const ensureModal = (modalElement) => {
    if (!modalElement || !window.bootstrap?.Modal) {
      return null;
    }
    return window.bootstrap.Modal.getOrCreateInstance(modalElement);
  };

  const setCaptureMode = (mode) => {
    if (!frontInput || !backInput) return;
    const captureValue = mode === 'camera' ? 'environment' : null;
    [frontInput, backInput].forEach((input) => {
      if (captureValue) {
        input.setAttribute('capture', captureValue);
      } else {
        input.removeAttribute('capture');
      }
      input.value = '';
    });
    if (modeStatus) {
      modeStatus.textContent =
        mode === 'camera'
          ? 'Modo câmera ativado. Tire as fotos.'
          : 'Escolha imagens da galeria.';
    }
  };

  fillButtons.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const modal = ensureModal(fillModalEl);
      if (modal) {
        modal.show();
      }
    });
  });

  settingsButtons.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const modal = ensureModal(settingsModalEl);
      if (modal) {
        modal.show();
      }
    });
  });

  if (modeCameraBtn) {
    modeCameraBtn.addEventListener('click', () => setCaptureMode('camera'));
  }

  if (modeGalleryBtn) {
    modeGalleryBtn.addEventListener('click', () => setCaptureMode('gallery'));
  }

  if (fillModalEl) {
    fillModalEl.addEventListener('show.bs.modal', () => {
      setCaptureMode('gallery');
    });
  }

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (window.PocAI && typeof window.PocAI.run === 'function') {
        window.PocAI.run();
      }
    });
  }
});
