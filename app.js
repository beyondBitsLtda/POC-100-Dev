// ==============================
// Form / Tabs (Cadastrar)
// ==============================
const form = document.getElementById('poc-form');
const tabButtons = document.querySelectorAll('#poc-form .tab');
const tabPanels = document.querySelectorAll('#poc-form .tab-panel');
const addBtn = document.getElementById('add-btn');
const viewButtons = document.querySelectorAll('[data-view]');
const viewPanels = document.querySelectorAll('[data-view-panel]');
const categoriaSelect = document.getElementById('categoriaInseguraSelect');
const subcategoriaSelect = document.getElementById('subcategoriaInseguraSelect');
const consultarBtn = document.getElementById('consultar-btn');
const consultaResultado = document.getElementById('consulta-resultado');

// IMPORTANT: existem IDs duplicados na área "Consultar".
// Sempre selecione os campos do formulário usando escopo do #poc-form.
const $f = (sel) => form.querySelector(sel);

const basicFields = [
  $f('#unidadeSelect'),
  $f('#setorSelect'),
  $f('#subsetorSelect'),
  $f('#observador'),
  $f('#data'),
  $f('#hora'),
  $f('#pessoas-observadas'),
  $f('#pessoas-area')
].filter(Boolean);

const unsafeFields = [
  $f('#categoriaInseguraSelect'),
  $f('#subcategoriaInseguraSelect'),
  $f('#observado'),
  $f('#quantidade'),
  $f('#pratica-insegura'),
  $f('#acao-recomendada')
].filter(Boolean);

const safeFields = [
  $f('#reconhecimento')
].filter(Boolean);

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
  const checked = form.querySelector('input[name="tipo-registro"]:checked');
  return checked ? checked.value : '';
};

const getTipoInseguraSelecionado = () => {
  const checked = form.querySelector('input[name="tipoInsegura"]:checked');
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

  // IA: só aparece nas abas específicas
  if (window.PocAI && typeof window.PocAI.syncVisibility === 'function') {
    window.PocAI.syncVisibility();
  }
};

const disableTab = (tabName, disabled) => {
  const tab = form.querySelector(`.tab[data-tab="${tabName}"]`);
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

form.querySelectorAll('input[name="tipo-registro"]').forEach((radio) => {
  radio.addEventListener('change', updateUI);
});

form.querySelectorAll('input[name="tipoInsegura"]').forEach((radio) => {
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

// ==============================
// IA: Preencher cartão de POC (Gemini OCR + contexto)
// ==============================
(function initPocAI() {
  // Dependência: Bootstrap (modal)
  const hasBootstrap = typeof bootstrap !== 'undefined' && bootstrap?.Modal;

  const STORAGE = {
    enabled: 'poc_ai_enabled',
    apiKey: 'poc_gemini_api_key',
    mode: 'poc_ai_source_mode'
  };

  // Botões duplicados (um em cada aba). Vamos manter ambos sincronizados.
  const btnFillUnsafe = document.getElementById('poc-ai-fill-btn');
  const btnSettingsUnsafe = document.getElementById('poc-ai-settings-btn');
  const btnFillSafe = document.getElementById('poc-ai-fill-btn-safe');
  const btnSettingsSafe = document.getElementById('poc-ai-settings-btn-safe');

  const logUnsafe = document.getElementById('poc-ai-log');
  const logSafe = document.getElementById('poc-ai-log-safe');

  const settingsModalEl = document.getElementById('pocAiSettingsModal');
  const fillModalEl = document.getElementById('pocAiFillModal');

  const apiKeyInput = document.getElementById('pocAiApiKey');
  const enabledToggle = document.getElementById('pocAiEnabled');
  const settingsStatus = document.getElementById('pocAiSettingsStatus');
  const saveSettingsBtn = document.getElementById('pocAiSaveSettings');

  const modeCameraBtn = document.getElementById('pocAiModeCamera');
  const modeGalleryBtn = document.getElementById('pocAiModeGallery');
  const frontInput = document.getElementById('pocAiFront');
  const backInput = document.getElementById('pocAiBack');
  const fillStatus = document.getElementById('pocAiFillStatus');
  const runBtn = document.getElementById('pocAiRun');

  // Se não existir markup (por qualquer motivo), aborta sem impactar o resto.
  if (!btnFillUnsafe || !btnSettingsUnsafe || !btnFillSafe || !btnSettingsSafe || !settingsModalEl || !fillModalEl) {
    return;
  }

  const showLog = (msg, { type = 'info', target = 'auto' } = {}) => {
    const isUnsafeActive = document.querySelector('#poc-form .tab.is-active')?.dataset.tab === 'inseguras';
    const isSafeActive = document.querySelector('#poc-form .tab.is-active')?.dataset.tab === 'seguras';

    let logEl = logUnsafe;
    if (target === 'unsafe') logEl = logUnsafe;
    if (target === 'safe') logEl = logSafe;
    if (target === 'auto') logEl = isSafeActive ? logSafe : logUnsafe;

    if (!logEl) return;
    const prefix = type === 'error' ? '⚠️ ' : 'ℹ️ ';
    logEl.textContent = `${prefix}${msg}`;
    logEl.classList.add('is-visible');
  };

  const clearLog = () => {
    [logUnsafe, logSafe].forEach((el) => {
      if (!el) return;
      el.textContent = '';
      el.classList.remove('is-visible');
    });
  };

  const setStatus = (el, msg, isError = false) => {
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('is-error', isError);
  };

  const getEnabled = () => localStorage.getItem(STORAGE.enabled) === 'true';
  const getApiKey = () => (localStorage.getItem(STORAGE.apiKey) || '').trim();
  const getMode = () => (localStorage.getItem(STORAGE.mode) || 'gallery');

  const setEnabled = (val) => localStorage.setItem(STORAGE.enabled, val ? 'true' : 'false');
  const setApiKey = (key) => localStorage.setItem(STORAGE.apiKey, (key || '').trim());
  const setMode = (mode) => localStorage.setItem(STORAGE.mode, mode);

  const openModal = (el) => {
    if (!hasBootstrap) return;
    const instance = bootstrap.Modal.getOrCreateInstance(el);
    instance.show();
  };

  const closeModal = (el) => {
    if (!hasBootstrap) return;
    const instance = bootstrap.Modal.getInstance(el);
    instance?.hide();
  };

  const syncButtonsEnabled = () => {
    const enabled = getEnabled();
    const hasKey = !!getApiKey();

    const shouldEnableFill = enabled && hasKey;
    btnFillUnsafe.disabled = !shouldEnableFill;
    btnFillSafe.disabled = !shouldEnableFill;

    if (enabled && !hasKey) {
      showLog('Ativei o Modo IA, mas falta salvar a API Key (⚙️ Opções IA).', { type: 'error' });
    }
  };

  const applyModeToInputs = (mode) => {
    // "camera" -> sugere câmera no mobile
    // "gallery" -> seletor normal
    const capture = mode === 'camera' ? 'environment' : null;
    [frontInput, backInput].forEach((inp) => {
      if (!inp) return;
      inp.value = '';
      inp.setAttribute('accept', 'image/*');
      if (capture) inp.setAttribute('capture', capture);
      else inp.removeAttribute('capture');
    });

    modeCameraBtn?.classList.toggle('is-active', mode === 'camera');
    modeGalleryBtn?.classList.toggle('is-active', mode !== 'camera');
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });

  const geminiGenerateContent = async ({ apiKey, parts, responseMimeType = 'application/json' }) => {
    // Endpoint oficial do Gemini API (Google AI Studio)
    // docs: ai.google.dev
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          response_mime_type: responseMimeType,
          temperature: 0.2
        }
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Gemini erro HTTP ${res.status}. ${text}`);
    }

    return res.json();
  };

  const extractJsonTextFromGemini = (payload) => {
    const candidate = payload?.candidates?.[0];
    const partText = candidate?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') || '';
    return partText.trim();
  };

  const safeJsonParse = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      // tenta recuperar JSON entre ```
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Resposta da IA não veio em JSON válido.');
      return JSON.parse(match[0]);
    }
  };

  const dispatch = (el, type) => {
    if (!el) return;
    el.dispatchEvent(new Event(type, { bubbles: true }));
  };

  const setValueSmart = (el, value, confidence = 1) => {
    if (!el) return;
    const newVal = (value ?? '').toString();
    const current = (el.value ?? '').toString();
    const hasCurrent = current.trim() !== '';

    // regra: não sobrescrever valores já preenchidos, a menos que confiança alta
    if (hasCurrent && confidence < 0.75) return;

    if (el.tagName === 'SELECT') {
      // só seta se existir option
      const hasOption = Array.from(el.options || []).some((o) => o.value === newVal || o.text === newVal);
      if (!hasOption && newVal) return;
      el.value = newVal;
      dispatch(el, 'change');
      return;
    }

    el.value = newVal;
    dispatch(el, 'input');
    dispatch(el, 'change');
  };

  const setRadio = (name, value) => {
    const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (!radio) return false;
    radio.checked = true;
    dispatch(radio, 'change');
    return true;
  };

  const waitForSelectOption = async (selectEl, desired, timeoutMs = 2500) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const has = Array.from(selectEl?.options || []).some((o) => o.value === desired || o.text === desired);
      if (has) return true;
      await new Promise((r) => setTimeout(r, 50));
    }
    return false;
  };

  const applyPocAutofill = async (json) => {
    clearLog();

    const confidence = json?.meta?.confidence || {};
    const basic = json?.basic || {};
    const unsafe = json?.unsafe || {};
    const safe = json?.safe || {};

    // 1) Tipo principal (isso controla tabs)
    if (basic.tipoRegistro === 'insegura' || basic.tipoRegistro === 'segura') {
      setRadio('tipo-registro', basic.tipoRegistro);
    }

    // 2) Básicos (cadeia unidade -> setor -> subsetor)
    const unidadeEl = $f('#unidadeSelect');
    const setorEl = $f('#setorSelect');
    const subsetorEl = $f('#subsetorSelect');

    setValueSmart(unidadeEl, basic.unidade, confidence.unidade ?? 1);
    await waitForSelectOption(setorEl, basic.setor).catch(() => false);
    setValueSmart(setorEl, basic.setor, confidence.setor ?? 1);
    await waitForSelectOption(subsetorEl, basic.subsetor).catch(() => false);
    setValueSmart(subsetorEl, basic.subsetor, confidence.subsetor ?? 1);

    setValueSmart($f('#observador'), basic.observador, confidence.observador ?? 1);
    setValueSmart($f('#acompanhante'), basic.acompanhante, confidence.acompanhante ?? 1);
    setValueSmart($f('#data'), basic.data, confidence.data ?? 1);
    setValueSmart($f('#hora'), basic.hora, confidence.hora ?? 1);
    setValueSmart($f('#pessoas-observadas'), basic.pessoasObservadas, confidence.pessoasObservadas ?? 1);
    setValueSmart($f('#pessoas-area'), basic.pessoasArea, confidence.pessoasArea ?? 1);

    // 3) Insegura
    if (basic.tipoRegistro === 'insegura') {
      if (unsafe.tipoInsegura === 'PRATICA' || unsafe.tipoInsegura === 'CONDICAO') {
        setRadio('tipoInsegura', unsafe.tipoInsegura);
      }

      const catEl = $f('#categoriaInseguraSelect');
      const subEl = $f('#subcategoriaInseguraSelect');

      // aguarda categorias povoarem após tipoInsegura
      await waitForSelectOption(catEl, unsafe.categoria).catch(() => false);
      setValueSmart(catEl, unsafe.categoria, confidence.categoria ?? 1);
      await waitForSelectOption(subEl, unsafe.subcategoria).catch(() => false);
      setValueSmart(subEl, unsafe.subcategoria, confidence.subcategoria ?? 1);

      setValueSmart($f('#observado'), unsafe.observado, confidence.observado ?? 1);
      setValueSmart($f('#quantidade'), unsafe.quantidade, confidence.quantidade ?? 1);
      setValueSmart($f('#pratica-insegura'), unsafe.praticaInsegura, confidence.praticaInsegura ?? 1);
      setValueSmart($f('#acao-recomendada'), unsafe.acaoRecomendada, confidence.acaoRecomendada ?? 1);

      if ((confidence.categoria ?? 1) < 0.75 || (confidence.subcategoria ?? 1) < 0.75) {
        showLog('Revise Categoria/Subcategoria: a IA ficou com baixa confiança.', { type: 'error', target: 'unsafe' });
      }
    }

    // 4) Segura
    if (basic.tipoRegistro === 'segura') {
      setValueSmart($f('#reconhecimento'), safe.reconhecimento, confidence.reconhecimento ?? 1);
      setValueSmart($f('#observacao'), safe.observacao, confidence.observacao ?? 1);
    }

    // notas extras
    const notes = Array.isArray(json?.meta?.notes) ? json.meta.notes : [];
    if (notes.length) {
      showLog(notes.join(' • '), { type: 'info' });
    }

    // força revalidação
    updateUI();
  };

  const buildPromptText = () => {
    // Envia as listas de categorias/subcategorias que já existem no JS global do index.html.
    // Isso ajuda o modelo a escolher valores EXATOS.
    const cats = (typeof INSEGURAS !== 'undefined') ? INSEGURAS : {};

    return [
      'Você vai receber 2 imagens (frente e verso) de um cartão de POC (Prática/Condição).',
      '1) Faça OCR e extraia o texto relevante.',
      '2) Interprete o conteúdo e retorne SOMENTE um JSON válido (sem markdown, sem texto extra).',
      '',
      'Regras:',
      '- Seja fiel ao que está escrito no cartão. Não invente dados.',
      '- Quando não houver informação, retorne string vazia "" ou 0.',
      '- Para campos de categoria/subcategoria, escolha valores EXATOS das listas fornecidas.',
      '- data deve ser YYYY-MM-DD (se não tiver, deixe vazio). hora HH:MM.',
      '',
      'Listas oficiais de categorias/subcategorias (use exatamente):',
      JSON.stringify(cats),
      '',
      'Formato de saída JSON (estrito):',
      '{',
      '  "basic": {',
      '    "unidade": "", "setor": "", "subsetor": "",',
      '    "observador": "", "acompanhante": "",',
      '    "data": "YYYY-MM-DD", "hora": "HH:MM",',
      '    "pessoasObservadas": 0, "pessoasArea": 0,',
      '    "tipoRegistro": "insegura|segura"',
      '  },',
      '  "unsafe": {',
      '    "tipoInsegura": "PRATICA|CONDICAO",',
      '    "categoria": "", "subcategoria": "",',
      '    "observado": "colaborador|terceiro|visitante",',
      '    "quantidade": 0,',
      '    "praticaInsegura": "",',
      '    "acaoRecomendada": ""',
      '  },',
      '  "safe": {',
      '    "reconhecimento": "",',
      '    "observacao": ""',
      '  },',
      '  "meta": {',
      '    "confidence": {',
      '      "unidade": 0, "setor": 0, "subsetor": 0,',
      '      "categoria": 0, "subcategoria": 0, "tipoRegistro": 0',
      '    },',
      '    "notes": []',
      '  }',
      '}'
    ].join('\n');
  };

  const runAi = async () => {
    clearLog();
    setStatus(fillStatus, 'Lendo cartão…');
    runBtn.disabled = true;

    try {
      if (!getEnabled()) {
        throw new Error('Modo IA está desligado. Ative em ⚙️ Opções IA.');
      }
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('API Key não configurada. Abra ⚙️ Opções IA e salve sua chave.');
      }

      const front = frontInput.files?.[0];
      const back = backInput.files?.[0];
      if (!front || !back) {
        throw new Error('Selecione as 2 imagens: Frente e Verso.');
      }

      const [frontB64, backB64] = await Promise.all([
        fileToBase64(front),
        fileToBase64(back)
      ]);

      const promptText = buildPromptText();
      const parts = [
        { text: promptText },
        { inlineData: { mimeType: front.type || 'image/jpeg', data: frontB64 } },
        { inlineData: { mimeType: back.type || 'image/jpeg', data: backB64 } }
      ];

      const payload = await geminiGenerateContent({ apiKey, parts, responseMimeType: 'application/json' });
      const jsonText = extractJsonTextFromGemini(payload);
      if (!jsonText) throw new Error('Resposta vazia da IA.');
      const result = safeJsonParse(jsonText);

      setStatus(fillStatus, 'Aplicando preenchimento no formulário…');
      await applyPocAutofill(result);

      setStatus(fillStatus, 'Pronto! Revise os campos antes de adicionar.');
      closeModal(fillModalEl);
    } catch (err) {
      const msg = err?.message || 'Erro inesperado ao processar o cartão.';
      setStatus(fillStatus, msg, true);
      showLog(msg, { type: 'error' });
    } finally {
      runBtn.disabled = false;
    }
  };

  const openSettings = () => {
    const enabled = getEnabled();
    const key = getApiKey();
    apiKeyInput.value = key;
    enabledToggle.checked = enabled;
    setStatus(settingsStatus, '');
    openModal(settingsModalEl);
  };

  const openFill = () => {
    if (!getEnabled()) {
      showLog('Ative o Modo IA nas opções (⚙️) para usar o preenchimento.', { type: 'error' });
      openSettings();
      return;
    }
    if (!getApiKey()) {
      showLog('Salve sua API Key nas opções (⚙️) para usar o preenchimento.', { type: 'error' });
      openSettings();
      return;
    }
    setStatus(fillStatus, '');
    applyModeToInputs(getMode());
    openModal(fillModalEl);
  };

  // Eventos (abrir)
  btnSettingsUnsafe.addEventListener('click', openSettings);
  btnSettingsSafe.addEventListener('click', openSettings);
  btnFillUnsafe.addEventListener('click', openFill);
  btnFillSafe.addEventListener('click', openFill);

  // Eventos (modo)
  modeCameraBtn?.addEventListener('click', () => {
    setMode('camera');
    applyModeToInputs('camera');
  });
  modeGalleryBtn?.addEventListener('click', () => {
    setMode('gallery');
    applyModeToInputs('gallery');
  });

  // Salvar settings
  saveSettingsBtn.addEventListener('click', () => {
    setEnabled(!!enabledToggle.checked);
    setApiKey(apiKeyInput.value);
    setStatus(settingsStatus, 'Configurações salvas!');
    syncButtonsEnabled();
    closeModal(settingsModalEl);
  });

  // Rodar
  runBtn.addEventListener('click', runAi);

  // Visibilidade: mostrar somente quando tab ativa for inseguras/seguras
  const toolbars = Array.from(document.querySelectorAll('[data-ai-toolbar]'));
  const syncVisibility = () => {
    const active = document.querySelector('#poc-form .tab.is-active')?.dataset.tab;
    toolbars.forEach((tb) => {
      const panel = tb.closest('.tab-panel');
      const panelName = panel?.dataset?.tabPanel;
      const visible = active === panelName && (panelName === 'inseguras' || panelName === 'seguras');
      tb.style.display = visible ? 'flex' : 'none';
    });
    // logs também só no painel certo
    if (logUnsafe) logUnsafe.style.display = active === 'inseguras' ? (logUnsafe.classList.contains('is-visible') ? 'block' : 'none') : 'none';
    if (logSafe) logSafe.style.display = active === 'seguras' ? (logSafe.classList.contains('is-visible') ? 'block' : 'none') : 'none';
  };

  // expõe para setActiveTab
  window.PocAI = {
    syncVisibility
  };

  // Inicial
  applyModeToInputs(getMode());
  syncButtonsEnabled();
  syncVisibility();

  // também sincroniza quando tipo-registro muda (tabs habilitam/desabilitam)
  form.querySelectorAll('input[name="tipo-registro"]').forEach((r) => r.addEventListener('change', () => {
    syncButtonsEnabled();
    syncVisibility();
  }));
})();
