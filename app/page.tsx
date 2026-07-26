"use client";

import { useEffect, useMemo, useState } from "react";
import { MakeupPreview } from "@/components/MakeupPreview";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import {
  generateLook,
  recommendProducts
} from "@/lib/recommendationEngine";
import {
  loadRecommendations,
  saveRecommendation
} from "@/lib/storage";
import type {
  MakeupLook,
  QuizAnswers,
  SavedRecommendation,
  Screen
} from "@/types";

const initialAnswers: QuizAnswers = {
  occasion: "",
  skinType: "",
  boldness: "",
  avoid: ""
};

const questions = [
  {
    key: "occasion" as const,
    title: "What occasion is this makeup look for?",
    example: "Choose one or more occasions.",
    options: [
      "Everyday",
      "Work",
      "School",
      "Interview",
      "Meeting",
      "Brunch",
      "Date",
      "Birthday",
      "Graduation",
      "Wedding",
      "Formal event",
      "Dinner",
      "Night out",
      "Party",
      "Concert"
    ],
    optional: false
  },
  {
    key: "skinType" as const,
    title: "What is your skin type?",
    example: "Choose one or more options that describe your skin.",
    options: [
      "Dry",
      "Oily",
      "Combination",
      "Balanced",
      "Sensitive",
      "Not sure"
    ],
    optional: false
  },
  {
    key: "boldness" as const,
    title: "How should the final makeup look feel?",
    example: "Choose one or more style keywords.",
    options: [
      "Very natural",
      "Subtle",
      "Minimal",
      "Polished",
      "Soft glam",
      "Elegant",
      "Classic",
      "Bold",
      "Dramatic",
      "Smoky",
      "Full glam"
    ],
    optional: false
  },
  {
    key: "avoid" as const,
    title: "Is there anything you want to avoid?",
    example: "Choose all that apply, or choose None.",
    options: [
      "Matte finish",
      "Shimmer",
      "Glitter",
      "Heavy coverage",
      "Fragrance",
      "Red shades",
      "Berry shades",
      "Glossy lips",
      "Powder products",
      "Strong contour",
      "None"
    ],
    optional: true
  }
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [look, setLook] = useState<MakeupLook>(() =>
    generateLook(initialAnswers)
  );
  const [error, setError] = useState("");
  const [hasSaved, setHasSaved] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [savedRecommendations, setSavedRecommendations] = useState<
    SavedRecommendation[]
  >([]);

  const recommendedProducts = useMemo(
    () => recommendProducts(answers, look),
    [answers, look]
  );

  useEffect(() => {
    const saved = loadRecommendations();
    setSavedRecommendations(saved);
    setHasSaved(saved.length > 0);
  }, []);

  const currentQuestion = questions[questionIndex];

  function getSelectedValues(key: keyof QuizAnswers): string[] {
    const value = answers[key];

    if (!value) {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function selectAnswer(option: string) {
    const key = currentQuestion.key;
    const currentSelections = getSelectedValues(key);

    let updatedSelections: string[];

    if (key === "avoid" && option === "None") {
      updatedSelections = currentSelections.includes("None") ? [] : ["None"];
    } else {
      const selectionsWithoutNone = currentSelections.filter(
        (item) => item !== "None"
      );

      if (selectionsWithoutNone.includes(option)) {
        updatedSelections = selectionsWithoutNone.filter(
          (item) => item !== option
        );
      } else {
        updatedSelections = [...selectionsWithoutNone, option];
      }
    }

    setAnswers((previous) => ({
      ...previous,
      [key]: updatedSelections.join(", ")
    }));

    setError("");
  }

  function isOptionSelected(option: string): boolean {
    return getSelectedValues(currentQuestion.key).includes(option);
  }

  function continueQuiz() {
    const selectedValues = getSelectedValues(currentQuestion.key);

    if (selectedValues.length === 0 && !currentQuestion.optional) {
      setError("Please choose at least one option before continuing.");
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
    } else {
      setScreen("review");
    }
  }

  function createPreview() {
    const newLook = generateLook(answers);
    setLook(newLook);
    setScreen("preview");
  }

  function confirmAndSave() {
    const timestamp = new Date().toISOString();

    const newRecommendation: SavedRecommendation = {
      answers,
      look,
      productIds: recommendedProducts.map((product) => product.id),
      savedAt: timestamp
    };

    saveRecommendation(newRecommendation);

    const updated = loadRecommendations();

    setSavedRecommendations(updated);
    setSavedAt(timestamp);
    setHasSaved(true);
    setScreen("saved");
  }

  function openSaved() {
    const saved = loadRecommendations();

    setSavedRecommendations(saved);
    setHasSaved(saved.length > 0);
    setScreen("saved");
  }

  return (
    <main className="app-shell">
      <div key={screen} className="screen-transition">
        <header className="site-header">
          <button
            className="brand"
            type="button"
            onClick={() => setScreen("welcome")}
          >
            <span className="brand-wordmark">FENTY BEAUTY</span>
          </button>

          <button className="text-button" type="button" onClick={openSaved}>
            Saved look
          </button>
        </header>

        {screen === "welcome" && (
          <section className="hero">
            <div>
              <p className="eyebrow">PERSONALIZED BEAUTY</p>
              <h1>
                <span>Your occasion.</span>
                <span>Your style.</span>
                <span>Your makeup look.</span>
              </h1>
              <p className="hero-tagline">
                Everyone deserves the freedom to define their own look.
              </p>

              <p className="hero-copy hero-copy-small">
                Answer four free-text questions. The prototype weighs occasion
                at 75% and desired boldness at 25%, then checks skin type and
                avoidances before selecting a routine.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setQuestionIndex(0);
                    setScreen("quiz");
                  }}
                >
                  Start the quiz
                </button>

                {hasSaved && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={openSaved}
                  >
                    Open saved recommendation
                  </button>
                )}
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="gold-orbit" />
              <div className="hero-face">
                <div className="hero-eye hero-eye-left" />
                <div className="hero-eye hero-eye-right" />
                <div className="hero-lips" />
              </div>
            </div>
          </section>
        )}

        {screen === "quiz" && (
          <section className="content-section narrow-section">
            <div className="progress-row">
              <span>
                Question {questionIndex + 1} of {questions.length}
              </span>
              <span>
                {Math.round(((questionIndex + 1) / questions.length) * 100)}%
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-value"
                style={{
                  width: `${((questionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>

            <article className="question-card">
              <p className="eyebrow">CREATE YOUR LOOK</p>
              <h2>{currentQuestion.title}</h2>
              <p className="question-example">{currentQuestion.example}</p>

              <div className="option-grid">
                {currentQuestion.options.map((option) => {
                  const selected = isOptionSelected(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      className={`option-chip ${selected ? "option-chip-selected" : ""}`}
                      onClick={() => selectAnswer(option)}
                      aria-pressed={selected}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="button-row">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    if (questionIndex === 0) {
                      setScreen("welcome");
                    } else {
                      setQuestionIndex((previous) => previous - 1);
                    }
                  }}
                >
                  Back
                </button>

                <button
                  className="primary-button"
                  type="button"
                  onClick={continueQuiz}
                >
                  {questionIndex === questions.length - 1
                    ? "Review answers"
                    : "Continue"}
                </button>
              </div>
            </article>
          </section>
        )}

        {screen === "review" && (
          <section className="content-section">
            <p className="eyebrow">REVIEW</p>
            <h2>Check your answers</h2>

            <div className="review-grid">
              {questions.map((question, index) => (
                <article className="review-card" key={question.key}>
                  <span>0{index + 1}</span>
                  <h3>{question.title}</h3>
                  <p>{answers[question.key] || "Nothing entered."}</p>

                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setQuestionIndex(index);
                      setScreen("quiz");
                    }}
                  >
                    Edit answer
                  </button>
                </article>
              ))}
            </div>

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setQuestionIndex(3);
                  setScreen("quiz");
                }}
              >
                Back
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={createPreview}
              >
                Generate my look
              </button>
            </div>
          </section>
        )}

        {screen === "preview" && (
          <section className="content-section">
            <p className="eyebrow">YOUR RECOMMENDED LOOK</p>
            <h2>{look.name}</h2>
            <p className="section-introduction">{look.summary}</p>

            <div className="preview-layout">
              <MakeupPreview look={look} />

              <div className="look-editor">
                <label>
                  Look name
                  <input
                    value={look.name}
                    onChange={(event) =>
                      setLook((previous) => ({
                        ...previous,
                        name: event.target.value
                      }))
                    }
                  />
                </label>

                <label>
                  Complexion
                  <textarea
                    rows={3}
                    value={look.complexion}
                    onChange={(event) =>
                      setLook((previous) => ({
                        ...previous,
                        complexion: event.target.value
                      }))
                    }
                  />
                </label>

                <label>
                  Eyes
                  <textarea
                    rows={3}
                    value={look.eyes}
                    onChange={(event) =>
                      setLook((previous) => ({
                        ...previous,
                        eyes: event.target.value
                      }))
                    }
                  />
                </label>

                <label>
                  Cheeks
                  <textarea
                    rows={3}
                    value={look.cheeks}
                    onChange={(event) =>
                      setLook((previous) => ({
                        ...previous,
                        cheeks: event.target.value
                      }))
                    }
                  />
                </label>

                <label>
                  Lips
                  <textarea
                    rows={3}
                    value={look.lips}
                    onChange={(event) =>
                      setLook((previous) => ({
                        ...previous,
                        lips: event.target.value
                      }))
                    }
                  />
                </label>

                <div className="control-grid">
                  <label>
                    Eye intensity
                    <input
                      type="range"
                      min="0.2"
                      max="1"
                      step="0.05"
                      value={look.eyeIntensity}
                      onChange={(event) =>
                        setLook((previous) => ({
                          ...previous,
                          eyeIntensity: Number(event.target.value)
                        }))
                      }
                    />
                  </label>

                  <label>
                    Glow
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={look.glow}
                      onChange={(event) =>
                        setLook((previous) => ({
                          ...previous,
                          glow: Number(event.target.value)
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setScreen("review")}
              >
                Back to answers
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => setScreen("products")}
              >
                Confirm this look
              </button>
            </div>
          </section>
        )}

        {screen === "products" && (
          <section className="content-section">
            <p className="eyebrow">COMPLETE ROUTINE</p>
            <h2>Products for {look.name}</h2>
            <p className="section-introduction">
              The prototype filters the sample catalogue using skin type,
              avoidance words, and the generated look. Product names and prices
              are prototype data and should be replaced with verified official
              Fenty Beauty catalogue data before launch.
            </p>

            <div className="product-grid">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setScreen("preview")}
              >
                Edit the look
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={confirmAndSave}
              >
                Save recommendation
              </button>
            </div>
          </section>
        )}

        {screen === "saved" && (
          <section className="content-section">
            <p className="eyebrow">SAVED RECOMMENDATIONS</p>
            <h2>Your saved looks</h2>

            <div className="saved-list">
              {savedRecommendations.map((item, index) => (
                <article className="saved-card" key={`${item.savedAt}-${index}`}>
                  <h3>{item.look.name}</h3>

                  <p>
                    Saved on{" "}
                    {new Date(item.savedAt).toLocaleString("en-US")}
                  </p>

                  <div className="saved-summary">
                    <p>
                      <strong>Complexion:</strong> {item.look.complexion}
                    </p>
                    <p>
                      <strong>Eyes:</strong> {item.look.eyes}
                    </p>
                    <p>
                      <strong>Cheeks:</strong> {item.look.cheeks}
                    </p>
                    <p>
                      <strong>Lips:</strong> {item.look.lips}
                    </p>
                  </div>

                  <div className="button-row">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => {
                        setAnswers(item.answers);
                        setLook(item.look);
                        setScreen("preview");
                      }}
                    >
                      Edit look
                    </button>

                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => {
                        setAnswers(item.answers);
                        setLook(item.look);
                        setScreen("products");
                      }}
                    >
                      View products
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
