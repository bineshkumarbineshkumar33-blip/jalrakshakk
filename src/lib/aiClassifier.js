import * as tf from "@tensorflow/tfjs";
import * as mobilenetLib from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { saveClassifierDataset, loadClassifierDataset } from "./storage";
import { WASTE_CLASSES } from "./priority";

let mobilenetModel = null;
let classifier = null;

export async function initModel() {
  if (!mobilenetModel) {
    mobilenetModel = await mobilenetLib.load({ version: 2, alpha: 1.0 });
  }
  if (!classifier) {
    classifier = knnClassifier.create();
    restoreFromStorage();
  }
  return { mobilenetModel, classifier };
}

export async function addExample(imgElement, classKey) {
  const { mobilenetModel, classifier } = await initModel();
  const activation = mobilenetModel.infer(imgElement, true);
  classifier.addExample(activation, classKey);
  activation.dispose();
  persistToStorage();
}

export async function classifyImage(imgElement) {
  const { mobilenetModel, classifier } = await initModel();
  if (classifier.getNumClasses() === 0) return null;
  const activation = mobilenetModel.infer(imgElement, true);
  const result = await classifier.predictClass(activation, 10);
  activation.dispose();
  return {
    classKey: result.label,
    confidence: result.confidences[result.label],
    scores: result.confidences,
  };
}

export async function getExampleCounts() {
  await initModel();
  const counts = classifier.getClassExampleCount();
  return WASTE_CLASSES.reduce((acc, c) => {
    acc[c.key] = counts[c.key] || 0;
    return acc;
  }, {});
}

export function isTrained() {
  return classifier ? classifier.getNumClasses() > 0 : false;
}

export async function resetTraining() {
  await initModel();
  classifier.clearAllClasses();
  persistToStorage();
}

function persistToStorage() {
  if (!classifier) return;
  const dataset = classifier.getClassifierDataset();
  const serializable = {};
  Object.keys(dataset).forEach((key) => {
    const data = dataset[key].dataSync();
    serializable[key] = { shape: dataset[key].shape, data: Array.from(data) };
  });
  saveClassifierDataset(serializable);
}

function restoreFromStorage() {
  const saved = loadClassifierDataset();
  if (!saved) return;
  const dataset = {};
  Object.keys(saved).forEach((key) => {
    dataset[key] = tf.tensor(saved[key].data, saved[key].shape);
  });
  classifier.setClassifierDataset(dataset);
}
