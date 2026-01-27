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
  const progress = document.getElementById('pocAiProgress');
  const error = document.getElementById('pocAiError');
  const runBtn = document.getElementById('pocAiRun');
  const log = document.getElementById('pocAiLog');
  const recognized = {
    frontText: '',
    backText: '',
    combinedText: ''
  };

  if (!front?.files?.length || !back?.files?.length) {
    status.textContent = 'Selecione a frente e o verso do cartão.';
    return;
  }

  if (!window.Tesseract) {
    status.textContent = 'Biblioteca OCR indisponível. Recarregue a página.';
    return;
  }

  const logStep = (message) => {
    if (!log) return;
    const entry = document.createElement('div');
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  };

  const clearLog = () => {
    if (!log) return;
    log.textContent = '';
  };

  const normalizeOcrText = (text) => {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const cleanTextField = (text) => {
    const lines = normalizeOcrText(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const unique = [...new Set(lines)];
    return unique.join('\n');
  };

  const getAiSettings = () => {
    const apiKey = localStorage.getItem('pocAiApiKey') || '';
    const enabled = localStorage.getItem('pocAiEnabled') === 'true';
    return { apiKey, enabled };
  };

  // Aguarda o carregamento de opções em um select dinâmico.
  const waitForOptions = (select, minOptions = 2, timeout = 1500) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (select?.options?.length >= minOptions) {
          resolve(true);
          return;
        }
        if (Date.now() - start > timeout) {
          resolve(false);
          return;
        }
        setTimeout(check, 60);
      };
      check();
    });
  };

  const getValidOptions = (select) => {
    return Array.from(select?.options || [])
      .map((opt) => opt.value)
      .filter((value) => value !== '');
  };

  const setSelectIfValid = (select, value) => {
    if (!select || !value || select.value.trim()) return false;
    const options = getValidOptions(select);
    if (!options.includes(value)) return false;
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  const setRadioIfValid = (name, value) => {
    if (!value) return false;
    const existing = document.querySelector(`input[name="${name}"]:checked`);
    if (existing) return false;
    const target = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (!target) return false;
    target.checked = true;
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  // Constrói o payload de opções válidas de categorias/subcategorias.
  const buildInsegurasOptionsPayload = (insegurasData) => {
    const tipos = Object.keys(insegurasData || {});
    const categoriasPorTipo = tipos.reduce((acc, tipo) => {
      acc[tipo] = Object.keys(insegurasData[tipo] || {});
      return acc;
    }, {});
    const subcategoriasPorTipo = tipos.reduce((acc, tipo) => {
      const categorias = insegurasData[tipo] || {};
      acc[tipo] = Object.keys(categorias).reduce((catAcc, categoria) => {
        catAcc[categoria] = categorias[categoria] || [];
        return catAcc;
      }, {});
      return acc;
    }, {});
    return {
      tipos,
      categoriasPorTipo,
      subcategoriasPorTipo
    };
  };

  // Envia o texto OCR para o Gemini e retorna o JSON parseado.
  const callGeminiToParse = async (ocrText, options) => {
    const prompt = `
Você extrai dados de um cartão POC. Retorne apenas JSON válido (sem markdown).

Tarefa:
- Interpretar o texto OCR abaixo e preencher os campos solicitados.
- Para radios/selects, use somente valores das listas fornecidas (match exato) ou null.
- Se não tiver certeza, use null.
- Use strings curtas e objetivas para texto.
- Não inclua dados do formulário como data, hora, observador, unidade, setor.

Schema obrigatório:
{
  "tipoRegistro": "insegura",
  "tipoInsegura": "PRATICA" | "CONDICAO" | null,
  "categoria": string | null,
  "subcategoria": string | null,
  "observado": "colaborador" | "terceiro" | "visitante" | null,
  "quantidade": number | null,
  "praticaInsegura": string | null,
  "acaoRecomendada": string | null
}

Listas válidas (use match exato):
tiposValidos: ${JSON.stringify(options.tipos)}
categoriasValidasPorTipo: ${JSON.stringify(options.categoriasPorTipo)}
subcategoriasPorTipo: ${JSON.stringify(options.subcategoriasPorTipo)}
observadoOpcoes: ["colaborador", "terceiro", "visitante"]

Texto OCR (frente/verso):
${ocrText}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${options.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 768
          }
        })
      }
    );
    if (!response.ok) {
      throw new Error('Erro ao chamar Gemini.');
    }
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      throw new Error('Gemini não retornou conteúdo.');
    }
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  };

  clearLog();

  if (runBtn) {
    runBtn.disabled = true;
  }

  if (error) {
    error.classList.add('d-none');
    error.textContent = '';
  }
  if (progress) {
    progress.classList.remove('d-none');
    progress.textContent = 'Preparando leitura OCR…';
  }

  status.textContent = 'Enviando imagens para leitura por IA…';

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Falha ao ler imagem.'));
      reader.readAsDataURL(file);
    });
  };

  const recognizeImage = async (file, label) => {
    const imageData = await readFileAsDataUrl(file);
    const result = await window.Tesseract.recognize(imageData, 'por', {
      logger: (message) => {
        if (progress && message.status) {
          const pct = Math.round((message.progress || 0) * 100);
          progress.textContent = `${label}: ${message.status} ${pct}%`;
        }
      }
    });
    return result?.data?.text || '';
  };

  const applyOcrFallback = (selectedType, combinedText, frontText, backText) => {
    const fallbackText = combinedText || frontText || backText;
    const pratica = document.getElementById('pratica-insegura');
    const acao = document.getElementById('acao-recomendada');
    const reconhecimento = document.getElementById('reconhecimento');

    if (selectedType === 'insegura' && pratica && !pratica.value.trim()) {
      pratica.value = fallbackText;
    }
    if (selectedType === 'insegura' && acao && !acao.value.trim()) {
      acao.value = fallbackText;
    }
    if (selectedType === 'segura' && reconhecimento && !reconhecimento.value.trim()) {
      reconhecimento.value = fallbackText;
    }
  };

  // Aplica o JSON interpretado no formulário com validação e ordem obrigatória.
  const applyParsedToForm = async (payload, options) => {
    if (!payload) return false;
    let didApply = false;

    const validTipos = ['PRATICA', 'CONDICAO'];
    const tipoInsegura = validTipos.includes(payload.tipoInsegura)
      ? payload.tipoInsegura
      : null;
    const categoria =
      tipoInsegura && options.categoriasPorTipo[tipoInsegura]?.includes(payload.categoria)
        ? payload.categoria
        : null;
    const subcategoria =
      tipoInsegura
      && categoria
      && (options.subcategoriasPorTipo[tipoInsegura]?.[categoria] || []).includes(
        payload.subcategoria
      )
        ? payload.subcategoria
        : null;
    const observadoOpcoes = ['colaborador', 'terceiro', 'visitante'];
    const observado = observadoOpcoes.includes(payload.observado) ? payload.observado : null;
    const quantidade = Number.isFinite(Number(payload.quantidade))
      ? Math.round(Number(payload.quantidade))
      : null;
    const quantidadeValida = quantidade && quantidade >= 1 ? quantidade : null;
    const praticaTexto = payload.praticaInsegura ? cleanTextField(payload.praticaInsegura) : null;
    const acaoTexto = payload.acaoRecomendada ? cleanTextField(payload.acaoRecomendada) : null;

    const tipoRegistroSet = setRadioIfValid('tipo-registro', 'insegura');
    if (tipoRegistroSet) {
      didApply = true;
    }

    const tipoSet = setRadioIfValid('tipoInsegura', tipoInsegura);
    if (tipoSet) {
      didApply = true;
    }

    if (tipoSet || tipoRegistroSet) {
      await waitForOptions(categoriaSelect, 2, 1500);
    }

    if (categoria) {
      const categoriaSet = setSelectIfValid(categoriaSelect, categoria);
      if (categoriaSet) {
        await waitForOptions(subcategoriaSelect, 2, 1500);
        didApply = true;
      }
    }

    if (subcategoria) {
      const subcategoriaSet = setSelectIfValid(subcategoriaSelect, subcategoria);
      if (subcategoriaSet) {
        didApply = true;
      }
    }

    const observadoSelect = document.getElementById('observado');
    if (observadoSelect && observado && !observadoSelect.value.trim()) {
      const validObservado = getValidOptions(observadoSelect);
      if (validObservado.includes(observado)) {
        observadoSelect.value = observado;
        observadoSelect.dispatchEvent(new Event('change', { bubbles: true }));
        didApply = true;
      }
    }

    const quantidadeInput = document.getElementById('quantidade');
    if (quantidadeInput && quantidadeInput.value.trim() === '' && quantidadeValida) {
      quantidadeInput.value = String(quantidadeValida);
      quantidadeInput.dispatchEvent(new Event('input', { bubbles: true }));
      didApply = true;
    }

    const praticaField = document.getElementById('pratica-insegura');
    if (praticaField && praticaTexto && !praticaField.value.trim()) {
      praticaField.value = praticaTexto;
      didApply = true;
    }
    const acaoField = document.getElementById('acao-recomendada');
    if (acaoField && acaoTexto && !acaoField.value.trim()) {
      acaoField.value = acaoTexto;
      didApply = true;
    }
    return didApply;
  };

  try {
    status.textContent = 'Imagens recebidas. Interpretando conteúdo…';
    const [frontText, backText] = await Promise.all([
      recognizeImage(front.files[0], 'Frente'),
      recognizeImage(back.files[0], 'Verso')
    ]);

    const combinedText = normalizeOcrText(
      [frontText, backText].map((text) => text.trim()).filter(Boolean).join('\n\n')
    );
    const selectedType = getSelectedType();
    recognized.frontText = frontText;
    recognized.backText = backText;
    recognized.combinedText = combinedText;

    logStep('OCR ok');

    if (selectedType === 'insegura') {
      const { apiKey, enabled } = getAiSettings();
      const insegurasData = window.INSEGURAS || {};
      const optionsPayload = buildInsegurasOptionsPayload(insegurasData);

      if (enabled && apiKey && Object.keys(insegurasData).length) {
        logStep('Interpretando com Gemini...');
        try {
          const parsed = await callGeminiToParse(combinedText || frontText || backText, {
            apiKey,
            ...optionsPayload
          });
          logStep('JSON ok');
          logStep('Aplicando campos...');
          const applied = await applyParsedToForm(parsed, optionsPayload);
          if (!applied) {
            logStep('Nenhum campo aplicável retornado. Usando OCR como fallback.');
            applyOcrFallback(selectedType, combinedText, frontText, backText);
          }
        } catch (geminiError) {
          if (error) {
            error.classList.remove('d-none');
            error.textContent = geminiError?.message || 'Falha ao interpretar com Gemini.';
          }
          logStep('Falha no Gemini. Usando OCR como fallback.');
          applyOcrFallback(selectedType, combinedText, frontText, backText);
        }
      } else {
        if (!enabled) {
          logStep('Modo IA desativado. Usando OCR como fallback.');
        } else if (!apiKey) {
          logStep('Chave do Gemini ausente. Usando OCR como fallback.');
        } else {
          logStep('Dados de categorias indisponíveis. Usando OCR como fallback.');
        }
        applyOcrFallback(selectedType, combinedText, frontText, backText);
      }
    }

    if (selectedType === 'segura') {
      const reconhecimento = document.getElementById('reconhecimento');
      if (reconhecimento && !reconhecimento.value.trim()) {
        reconhecimento.value = combinedText || frontText || backText;
      }
    }

    updateUI();
    logStep('Concluído');
    status.textContent = 'Leitura concluída. Campos preenchidos.';
  } catch (err) {
    if (error) {
      error.classList.remove('d-none');
      error.textContent = err?.message || 'Erro ao ler imagens.';
    }
    logStep('Erro ao interpretar imagens. Aplicando fallback OCR.');
    try {
      const selectedType = getSelectedType();
      applyOcrFallback(
        selectedType,
        recognized.combinedText,
        recognized.frontText,
        recognized.backText
      );
      updateUI();
    } catch (fallbackError) {
      console.error(fallbackError);
    }
    status.textContent = 'Não foi possível interpretar as imagens.';
  } finally {
    if (progress) {
      progress.classList.add('d-none');
    }
    if (runBtn) {
      runBtn.disabled = false;
    }
  }
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
  const settingsKeyInput = document.getElementById('pocAiApiKey');
  const settingsEnabledInput = document.getElementById('pocAiEnabled');
  const settingsSaveBtn = document.getElementById('pocAiSaveSettings');
  const settingsStatus = document.getElementById('pocAiSettingsStatus');

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

  const loadAiSettings = () => {
    if (!settingsKeyInput || !settingsEnabledInput) return;
    settingsKeyInput.value = localStorage.getItem('pocAiApiKey') || '';
    settingsEnabledInput.checked = localStorage.getItem('pocAiEnabled') === 'true';
  };

  const saveAiSettings = () => {
    if (!settingsKeyInput || !settingsEnabledInput) return;
    localStorage.setItem('pocAiApiKey', settingsKeyInput.value.trim());
    localStorage.setItem('pocAiEnabled', settingsEnabledInput.checked ? 'true' : 'false');
    if (settingsStatus) {
      settingsStatus.classList.remove('d-none');
      settingsStatus.textContent = 'Configurações salvas com sucesso.';
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

  if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener('click', saveAiSettings);
  }

  if (settingsModalEl) {
    settingsModalEl.addEventListener('show.bs.modal', () => {
      loadAiSettings();
      if (settingsStatus) {
        settingsStatus.classList.add('d-none');
        settingsStatus.textContent = '';
      }
    });
  }

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
