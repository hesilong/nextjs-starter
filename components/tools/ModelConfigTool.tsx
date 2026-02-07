"use client";

import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Download,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const DEFAULT_CONTEXT_WINDOW = 200000;
const DEFAULT_COST = 0;

type ModelInput = {
  id: string;
  name: string;
  reasoning: boolean;
  input: {
    text: boolean;
    image: boolean;
  };
  maxTokens: string;
  contextWindow: string;
  costInput: string;
  costOutput: string;
  costCacheRead: string;
  costCacheWrite: string;
  showAdvanced: boolean;
};

type ProviderInput = {
  key: string;
  baseUrl: string;
  apiKey: string;
  api: string;
  apiCustom: string;
  models: ModelInput[];
};

const createEmptyModel = (): ModelInput => ({
  id: "",
  name: "",
  reasoning: false,
  input: { text: true, image: false },
  maxTokens: "4096",
  contextWindow: String(DEFAULT_CONTEXT_WINDOW),
  costInput: String(DEFAULT_COST),
  costOutput: String(DEFAULT_COST),
  costCacheRead: String(DEFAULT_COST),
  costCacheWrite: String(DEFAULT_COST),
  showAdvanced: false,
});

const createEmptyProvider = (): ProviderInput => ({
  key: "",
  baseUrl: "",
  apiKey: "",
  api: "openai-completions",
  apiCustom: "",
  models: [createEmptyModel()],
});

const apiOptions = [
  { value: "openai-completions", label: "openai-completions" },
  { value: "openai-responses", label: "openai-responses" },
  { value: "custom", label: "Custom" },
];

type UploadedConfig = {
  name: string;
  data: Record<string, unknown>;
};

export default function ModelConfigTool() {
  const t = useTranslations("ConfigTool");
  const [providers, setProviders] = useState<ProviderInput[]>([
    createEmptyProvider(),
  ]);
  const [primaryModel, setPrimaryModel] = useState<string>("");
  const [uploaded, setUploaded] = useState<UploadedConfig | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [outputMode, setOutputMode] = useState<"full" | "snippet">("snippet");
  const [uploadKey, setUploadKey] = useState(0);

  const modelOptions = useMemo(() => {
    return providers
      .flatMap((provider) =>
        provider.models
          .map((model) => {
            if (!provider.key.trim() || !model.id.trim()) return null;
            const key = `${provider.key.trim()}/${model.id.trim()}`;
            const label = `${key} - ${model.name || t("unnamedModel")}`;
            return { key, label };
          })
          .filter(Boolean)
      )
      .filter(Boolean) as { key: string; label: string }[];
  }, [providers, t]);

  const primaryModelValue = useMemo(() => {
    if (primaryModel && modelOptions.find((opt) => opt.key === primaryModel)) {
      return primaryModel;
    }
    return modelOptions[0]?.key || "";
  }, [modelOptions, primaryModel]);

  const setProvider = (index: number, patch: Partial<ProviderInput>) => {
    setProviders((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  };

  const setModel = (
    providerIndex: number,
    modelIndex: number,
    patch: Partial<ModelInput>
  ) => {
    setProviders((prev) =>
      prev.map((provider, idx) => {
        if (idx !== providerIndex) return provider;
        const models = provider.models.map((model, mIdx) =>
          mIdx === modelIndex ? { ...model, ...patch } : model
        );
        return { ...provider, models };
      })
    );
  };

  const addProvider = () => {
    setProviders((prev) => [...prev, createEmptyProvider()]);
  };

  const removeProvider = (index: number) => {
    setProviders((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addModel = (providerIndex: number) => {
    setProviders((prev) =>
      prev.map((provider, idx) =>
        idx === providerIndex
          ? { ...provider, models: [...provider.models, createEmptyModel()] }
          : provider
      )
    );
  };

  const removeModel = (providerIndex: number, modelIndex: number) => {
    setProviders((prev) =>
      prev.map((provider, idx) => {
        if (idx !== providerIndex) return provider;
        const models = provider.models.filter((_, mIdx) => mIdx !== modelIndex);
        return { ...provider, models: models.length ? models : [createEmptyModel()] };
      })
    );
  };
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    providers.forEach((provider, idx) => {
      if (!provider.key.trim()) {
        errors.push(t("errors.providerKey", { index: idx + 1 }));
      }
      if (!provider.baseUrl.trim()) {
        errors.push(t("errors.baseUrl", { index: idx + 1 }));
      }
      if (!provider.apiKey.trim()) {
        errors.push(t("errors.apiKey", { index: idx + 1 }));
      }
      provider.models.forEach((model, mIdx) => {
        if (!model.id.trim()) {
          errors.push(t("errors.modelId", { index: idx + 1, model: mIdx + 1 }));
        }
        if (!model.name.trim()) {
          errors.push(
            t("errors.modelName", { index: idx + 1, model: mIdx + 1 })
          );
        }
        if (!model.input.text && !model.input.image) {
          errors.push(
            t("errors.modelInput", { index: idx + 1, model: mIdx + 1 })
          );
        }
        if (!model.maxTokens.trim() || Number.isNaN(Number(model.maxTokens))) {
          errors.push(
            t("errors.maxTokens", { index: idx + 1, model: mIdx + 1 })
          );
        }
      });
    });
    if (!primaryModelValue) {
      errors.push(t("errors.primaryModel"));
    }
    return errors;
  }, [providers, primaryModelValue, t]);

  const generatedConfig = useMemo(() => {
    const providersObject: Record<string, unknown> = {};
    const modelAliases: Record<string, { alias: string }> = {};

    providers.forEach((provider) => {
      const providerKey = provider.key.trim();
      if (!providerKey) return;

      const apiValue =
        provider.api === "custom" ? provider.apiCustom.trim() : provider.api;

      const providerModels = provider.models.map((model) => {
        const input: string[] = [];
        if (model.input.text) input.push("text");
        if (model.input.image) input.push("image");

        const contextWindow = Number(model.contextWindow || DEFAULT_CONTEXT_WINDOW);
        const maxTokens = Number(model.maxTokens || 0);
        const cost = {
          input: Number(model.costInput || DEFAULT_COST),
          output: Number(model.costOutput || DEFAULT_COST),
          cacheRead: Number(model.costCacheRead || DEFAULT_COST),
          cacheWrite: Number(model.costCacheWrite || DEFAULT_COST),
        };

        const modelId = model.id.trim();
        const fullKey = `${providerKey}/${modelId}`;
        if (modelId) {
          modelAliases[fullKey] = { alias: model.name.trim() || modelId };
        }

        return {
          id: modelId,
          name: model.name.trim(),
          reasoning: model.reasoning,
          input,
          cost,
          contextWindow: Number.isNaN(contextWindow)
            ? DEFAULT_CONTEXT_WINDOW
            : contextWindow,
          maxTokens: Number.isNaN(maxTokens) ? 0 : maxTokens,
        };
      });

      providersObject[providerKey] = {
        baseUrl: provider.baseUrl.trim(),
        apiKey: provider.apiKey.trim(),
        api: apiValue || "openai-completions",
        models: providerModels,
      };
    });

    return {
      models: {
        mode: "merge",
        providers: providersObject,
      },
      agents: {
        defaults: {
          model: {
            primary: primaryModelValue,
          },
          models: modelAliases,
          compaction: {
            mode: "safeguard",
          },
          maxConcurrent: 4,
          subagents: {
            maxConcurrent: 8,
          },
        },
      },
    };
  }, [providers, primaryModelValue]);

  const mergedConfig = useMemo(() => {
    if (!uploaded?.data) return generatedConfig;

    const clone = JSON.parse(JSON.stringify(uploaded.data)) as Record<
      string,
      unknown
    >;

    const ensureObject = (value: unknown) =>
      value && typeof value === "object" ? value : {};

    const models = ensureObject(clone.models) as Record<string, unknown>;
    const providersObj = ensureObject(models.providers) as Record<string, unknown>;
    const newProviders = (generatedConfig.models.providers ||
      {}) as Record<string, unknown>;

    Object.entries(newProviders).forEach(([key, value]) => {
      const incoming = value as Record<string, unknown>;
      const existing = ensureObject(providersObj[key]) as Record<string, unknown>;

      const mergedModels = [
        ...((existing.models as unknown[]) || []),
      ] as Record<string, unknown>[];
      const incomingModels = (incoming.models as Record<string, unknown>[]) || [];

      const byId = new Map<string, Record<string, unknown>>();
      mergedModels.forEach((model) => {
        if (model?.id) byId.set(String(model.id), model);
      });
      incomingModels.forEach((model) => {
        if (model?.id) byId.set(String(model.id), model);
      });

      providersObj[key] = {
        ...existing,
        ...incoming,
        models: Array.from(byId.values()),
      };
    });

    models.mode = "merge";
    models.providers = providersObj;
    clone.models = models;

    const agents = ensureObject(clone.agents) as Record<string, unknown>;
    const defaults = ensureObject(agents.defaults) as Record<string, unknown>;
    const defaultsModel = ensureObject(defaults.model) as Record<string, unknown>;
    const defaultsModels = ensureObject(defaults.models) as Record<string, unknown>;

    defaultsModel.primary = primaryModelValue;
    defaults.model = defaultsModel;
    defaults.models = {
      ...defaultsModels,
      ...generatedConfig.agents.defaults.models,
    };

    agents.defaults = defaults;
    clone.agents = agents;

    const auth = ensureObject(clone.auth) as Record<string, unknown>;
    if ("profiles" in auth) {
      delete auth.profiles;
    }
    if (Object.keys(auth).length === 0) {
      delete clone.auth;
    } else {
      clone.auth = auth;
    }

    return clone;
  }, [generatedConfig, primaryModelValue, uploaded]);

  const outputJson = useMemo(
    () => JSON.stringify(mergedConfig, null, 2),
    [mergedConfig]
  );

  const snippetJson = useMemo(() => {
    const snippet = JSON.stringify(
      { models: generatedConfig.models, agents: generatedConfig.agents },
      null,
      2
    );
    return snippet.replace(/^\{\n/, "").replace(/\n\}$/, "");
  }, [generatedConfig]);

  const effectiveMode =
    uploaded && outputMode === "snippet" ? "full" : outputMode;
  const outputText = effectiveMode === "full" ? outputJson : snippetJson;

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Record<string, unknown>;
      setUploaded({ name: file.name, data });
      setUploadError("");
      setUploadKey((key) => key + 1);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : t("upload.invalid")
      );
      setUploaded(null);
      setUploadKey((key) => key + 1);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (effectiveMode !== "full") return;
    const blob = new Blob([outputJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = uploaded?.name || "openclaw-model-config.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
          {t("eyebrow")}
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {t("description")}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">{t("privacy")}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t("providers.title")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("providers.subtitle")}
                </p>
              </div>
              <Button variant="outline" onClick={addProvider}>
                <Plus className="mr-2 h-4 w-4" />
                {t("providers.add")}
              </Button>
            </div>

            <div className="mt-6 space-y-6">
              {providers.map((provider, providerIndex) => (
                <div
                  key={`provider-${providerIndex}`}
                  className="rounded-2xl border border-border bg-background/90 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {t("providers.itemTitle", { index: providerIndex + 1 })}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("providers.itemHint")}
                      </p>
                    </div>
                    {providers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProvider(providerIndex)}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-muted-foreground">
                      {t("providers.fields.key")}
                      <input
                        value={provider.key}
                        onChange={(e) =>
                          setProvider(providerIndex, { key: e.target.value })
                        }
                        placeholder="nvidia"
                        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("providers.fields.keyHint")}
                      </p>
                    </label>
                    <label className="text-sm text-muted-foreground">
                      {t("providers.fields.baseUrl")}
                      <input
                        value={provider.baseUrl}
                        onChange={(e) =>
                          setProvider(providerIndex, {
                            baseUrl: e.target.value,
                          })
                        }
                        placeholder="https://integrate.api.nvidia.com/v1"
                        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("providers.fields.baseUrlHint")}
                      </p>
                    </label>
                    <label className="text-sm text-muted-foreground">
                      {t("providers.fields.apiKey")}
                      <input
                        type="password"
                        value={provider.apiKey}
                        onChange={(e) =>
                          setProvider(providerIndex, {
                            apiKey: e.target.value,
                          })
                        }
                        placeholder="sk-..."
                        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                    <label className="text-sm text-muted-foreground">
                      {t("providers.fields.api")}
                      <div className="mt-2 flex gap-2">
                        <select
                          value={provider.api}
                          onChange={(e) =>
                            setProvider(providerIndex, { api: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                        >
                          {apiOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {provider.api === "custom" && (
                          <input
                            value={provider.apiCustom}
                            onChange={(e) =>
                              setProvider(providerIndex, {
                                apiCustom: e.target.value,
                              })
                            }
                            placeholder="openai-completions"
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                          />
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">
                        {t("models.title")}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addModel(providerIndex)}
                      >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        {t("models.add")}
                      </Button>
                    </div>

                    {provider.models.map((model, modelIndex) => (
                      <div
                        key={`model-${providerIndex}-${modelIndex}`}
                        className="rounded-xl border border-border bg-background/80 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            {t("models.itemTitle", {
                              index: modelIndex + 1,
                            })}
                          </p>
                          {provider.models.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeModel(providerIndex, modelIndex)
                              }
                              className="text-xs text-muted-foreground hover:text-primary"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <label className="text-xs text-muted-foreground">
                            {t("models.fields.id")}
                            <input
                              value={model.id}
                              onChange={(e) =>
                                setModel(providerIndex, modelIndex, {
                                  id: e.target.value,
                                })
                              }
                              placeholder="minimaxai/minimax-m2"
                              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              {t("models.fields.idHint")}
                            </p>
                          </label>
                          <label className="text-xs text-muted-foreground">
                            {t("models.fields.name")}
                            <input
                              value={model.name}
                              onChange={(e) =>
                                setModel(providerIndex, modelIndex, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="mini-max-thinking"
                              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              {t("models.fields.nameHint")}
                            </p>
                          </label>
                          <label className="text-xs text-muted-foreground">
                            {t("models.fields.maxTokens")}
                            <input
                              value={model.maxTokens}
                              onChange={(e) =>
                                setModel(providerIndex, modelIndex, {
                                  maxTokens: e.target.value,
                                })
                              }
                              type="number"
                              min={1}
                              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                            />
                          </label>
                          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                            <span className="text-xs text-muted-foreground">
                              {t("models.fields.reasoning")}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setModel(providerIndex, modelIndex, {
                                  reasoning: !model.reasoning,
                                })
                              }
                              className={`h-6 w-11 rounded-full border transition-colors ${
                                model.reasoning
                                  ? "bg-primary/20 border-primary"
                                  : "bg-muted border-border"
                              }`}
                            >
                              <span
                                className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                  model.reasoning ? "translate-x-5" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={model.input.text}
                              onChange={(e) =>
                                setModel(providerIndex, modelIndex, {
                                  input: {
                                    ...model.input,
                                    text: e.target.checked,
                                  },
                                })
                              }
                              className="h-4 w-4"
                            />
                            {t("models.fields.inputText")}
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={model.input.image}
                              onChange={(e) =>
                                setModel(providerIndex, modelIndex, {
                                  input: {
                                    ...model.input,
                                    image: e.target.checked,
                                  },
                                })
                              }
                              className="h-4 w-4"
                            />
                            {t("models.fields.inputImage")}
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setModel(providerIndex, modelIndex, {
                              showAdvanced: !model.showAdvanced,
                            })
                          }
                          className="mt-3 text-xs text-primary hover:underline"
                        >
                          {model.showAdvanced
                            ? t("models.hideAdvanced")
                            : t("models.showAdvanced")}
                        </button>

                        {model.showAdvanced && (
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <label className="text-xs text-muted-foreground">
                              {t("models.fields.contextWindow")}
                              <input
                                type="number"
                                value={model.contextWindow}
                                onChange={(e) =>
                                  setModel(providerIndex, modelIndex, {
                                    contextWindow: e.target.value,
                                  })
                                }
                                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                              />
                            </label>
                            <label className="text-xs text-muted-foreground">
                              {t("models.fields.costInput")}
                              <input
                                type="number"
                                value={model.costInput}
                                onChange={(e) =>
                                  setModel(providerIndex, modelIndex, {
                                    costInput: e.target.value,
                                  })
                                }
                                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                              />
                            </label>
                            <label className="text-xs text-muted-foreground">
                              {t("models.fields.costOutput")}
                              <input
                                type="number"
                                value={model.costOutput}
                                onChange={(e) =>
                                  setModel(providerIndex, modelIndex, {
                                    costOutput: e.target.value,
                                  })
                                }
                                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                              />
                            </label>
                            <label className="text-xs text-muted-foreground">
                              {t("models.fields.costCacheRead")}
                              <input
                                type="number"
                                value={model.costCacheRead}
                                onChange={(e) =>
                                  setModel(providerIndex, modelIndex, {
                                    costCacheRead: e.target.value,
                                  })
                                }
                                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                              />
                            </label>
                            <label className="text-xs text-muted-foreground">
                              {t("models.fields.costCacheWrite")}
                              <input
                                type="number"
                                value={model.costCacheWrite}
                                onChange={(e) =>
                                  setModel(providerIndex, modelIndex, {
                                    costCacheWrite: e.target.value,
                                  })
                                }
                                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">
              {t("primary.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("primary.subtitle")}
            </p>
            <select
              value={primaryModelValue}
              onChange={(e) => setPrimaryModel(e.target.value)}
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {modelOptions.length === 0 ? (
                <option value="">{t("primary.empty")}</option>
              ) : (
                modelOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {t("upload.title")}
              </h3>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("upload.subtitle")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("upload.recommendation")}
            </p>
            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-background/80 px-3 py-6 text-xs text-muted-foreground hover:border-primary/50">
              <input
                key={uploadKey}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0] || null)}
              />
              {t("upload.cta")}
            </label>
            {uploaded && (
              <div className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                {t("upload.loaded", { name: uploaded.name })}
              </div>
            )}
            {uploadError && (
              <p className="mt-3 text-xs text-red-500">{uploadError}</p>
            )}
            {uploaded && (
              <button
                type="button"
                onClick={() => {
                  setUploaded(null);
                  setUploadError("");
                  setUploadKey((key) => key + 1);
                }}
                className="mt-3 text-xs text-primary hover:underline"
              >
                {t("upload.clear")}
              </button>
            )}
          </div>
          <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("output.title")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("output.modeHelp")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={validationErrors.length > 0}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t("output.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      {t("output.copy")}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  disabled={validationErrors.length > 0 || effectiveMode !== "full"}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("output.download")}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOutputMode("full")}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  effectiveMode === "full"
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {t("output.modeFull")}
              </button>
              <button
                type="button"
                onClick={() => setOutputMode("snippet")}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  effectiveMode === "snippet"
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {t("output.modeSnippet")}
              </button>
            </div>
            {effectiveMode === "snippet" && (
              <p className="mt-3 text-xs text-amber-600">
                {t("output.snippetHint")}
              </p>
            )}
            {validationErrors.length > 0 && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                <p className="font-semibold">{t("errors.title")}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {validationErrors.map((error, index) => (
                    <li key={`${error}-${index}`}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <pre className="mt-4 max-h-[520px] overflow-auto rounded-xl bg-background/80 p-4 text-xs text-foreground">
              {outputText}
            </pre>
          </div>
        </aside>
      </div>
    </section>
  );
}
