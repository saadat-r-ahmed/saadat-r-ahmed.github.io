---
layout: post
title: ONNX for Model Optimization and Deployment
date: 2024-11-20 14:00:00
description: Leveraging ONNX Runtime for efficient ML model deployment across platforms
tags: machine-learning deployment optimization ONNX
categories: research
---

## What is ONNX?

Open Neural Network Exchange (ONNX) is an open-source format for representing machine learning models. It enables interoperability between different ML frameworks and provides optimized runtime execution across various hardware platforms.

## Why ONNX Matters

### Framework Agnostic
Train in PyTorch, TensorFlow, or scikit-learn, and deploy anywhere:

```python
import torch
import torch.onnx

# PyTorch model
model = MyNeuralNetwork()
model.eval()

# Export to ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    export_params=True,
    opset_version=14,
    input_names=['input'],
    output_names=['output']
)
```

### Performance Optimization
ONNX Runtime provides significant speedups:
- **Graph Optimizations**: Constant folding, operator fusion
- **Quantization**: INT8/FP16 precision reduction
- **Hardware Acceleration**: CPU, GPU, NPU support

## Converting Models to ONNX

### From PyTorch

```python
import torch.onnx
from transformers import AutoModel, AutoTokenizer

# Load pretrained model
model_name = "bert-base-uncased"
model = AutoModel.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Prepare dummy input
text = "Sample input for ONNX export"
inputs = tokenizer(text, return_tensors="pt")

# Export
torch.onnx.export(
    model,
    tuple(inputs.values()),
    "bert_model.onnx",
    input_names=['input_ids', 'attention_mask'],
    output_names=['last_hidden_state'],
    dynamic_axes={
        'input_ids': {0: 'batch_size', 1: 'sequence'},
        'attention_mask': {0: 'batch_size', 1: 'sequence'},
        'last_hidden_state': {0: 'batch_size', 1: 'sequence'}
    }
)
```

### From TensorFlow

```python
import tf2onnx
import tensorflow as tf

# Load TensorFlow model
model = tf.keras.models.load_model('my_model.h5')

# Convert to ONNX
spec = (tf.TensorSpec((None, 224, 224, 3), tf.float32, name="input"),)
output_path = "tf_model.onnx"

model_proto, _ = tf2onnx.convert.from_keras(
    model,
    input_signature=spec,
    opset=13,
    output_path=output_path
)
```

## ONNX Runtime Inference

### Basic Inference

```python
import onnxruntime as ort
import numpy as np

# Create inference session
session = ort.InferenceSession(
    "model.onnx",
    providers=['CUDAExecutionProvider', 'CPUExecutionProvider']
)

# Prepare input
input_name = session.get_inputs()[0].name
input_data = np.random.randn(1, 3, 224, 224).astype(np.float32)

# Run inference
outputs = session.run(None, {input_name: input_data})
```

### Optimized Inference Pipeline

```python
class ONNXInferencePipeline:
    def __init__(self, model_path: str, use_gpu: bool = True):
        providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] \
                    if use_gpu else ['CPUExecutionProvider']
        
        self.session = ort.InferenceSession(
            model_path,
            providers=providers
        )
        
        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name
    
    def preprocess(self, data):
        # Add preprocessing logic
        return data.astype(np.float32)
    
    def predict(self, data):
        processed = self.preprocess(data)
        outputs = self.session.run(
            [self.output_name],
            {self.input_name: processed}
        )
        return outputs[0]
    
    def batch_predict(self, batch_data, batch_size: int = 32):
        results = []
        for i in range(0, len(batch_data), batch_size):
            batch = batch_data[i:i+batch_size]
            result = self.predict(batch)
            results.append(result)
        return np.concatenate(results)
```

## Quantization for Edge Deployment

### Dynamic Quantization

```python
from onnxruntime.quantization import quantize_dynamic, QuantType

model_fp32 = 'model.onnx'
model_quant = 'model_quantized.onnx'

quantize_dynamic(
    model_fp32,
    model_quant,
    weight_type=QuantType.QUInt8
)
```

### Static Quantization

```python
from onnxruntime.quantization import quantize_static, CalibrationDataReader

class DataReader(CalibrationDataReader):
    def __init__(self, calibration_data):
        self.data = calibration_data
        self.iterator = iter(self.data)
    
    def get_next(self):
        try:
            return next(self.iterator)
        except StopIteration:
            return None

# Prepare calibration data
calibration_data = [
    {'input': np.random.randn(1, 3, 224, 224).astype(np.float32)}
    for _ in range(100)
]

quantize_static(
    'model.onnx',
    'model_static_quant.onnx',
    DataReader(calibration_data)
)
```

## Performance Benchmarking

```python
import time

def benchmark_model(session, input_data, num_runs=100):
    # Warmup
    for _ in range(10):
        session.run(None, input_data)
    
    # Benchmark
    start = time.time()
    for _ in range(num_runs):
        session.run(None, input_data)
    end = time.time()
    
    avg_time = (end - start) / num_runs
    throughput = 1.0 / avg_time
    
    return {
        'avg_latency_ms': avg_time * 1000,
        'throughput_fps': throughput
    }

# Compare FP32 vs Quantized
fp32_session = ort.InferenceSession('model.onnx')
quant_session = ort.InferenceSession('model_quantized.onnx')

input_data = {'input': np.random.randn(1, 3, 224, 224).astype(np.float32)}

fp32_perf = benchmark_model(fp32_session, input_data)
quant_perf = benchmark_model(quant_session, input_data)

print(f"FP32 - Latency: {fp32_perf['avg_latency_ms']:.2f}ms")
print(f"INT8 - Latency: {quant_perf['avg_latency_ms']:.2f}ms")
print(f"Speedup: {fp32_perf['avg_latency_ms'] / quant_perf['avg_latency_ms']:.2f}x")
```

## ONNX for NLP Models

### Optimizing Transformer Models

```python
from optimum.onnxruntime import ORTModelForSequenceClassification
from transformers import AutoTokenizer

# Load and optimize
model = ORTModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased-finetuned-sst-2-english",
    export=True
)
tokenizer = AutoTokenizer.from_pretrained(
    "distilbert-base-uncased-finetuned-sst-2-english"
)

# Inference
inputs = tokenizer("ONNX makes deployment easy!", return_tensors="pt")
outputs = model(**inputs)
predictions = outputs.logits.argmax(-1)
```

## Production Deployment

### FastAPI Integration

```python
from fastapi import FastAPI
from pydantic import BaseModel
import onnxruntime as ort

app = FastAPI()

# Load model at startup
session = ort.InferenceSession("model.onnx")

class PredictionRequest(BaseModel):
    data: list

class PredictionResponse(BaseModel):
    predictions: list

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    input_data = np.array(request.data).astype(np.float32)
    outputs = session.run(None, {'input': input_data})
    return PredictionResponse(predictions=outputs[0].tolist())
```

## Best Practices

1. **Version Control**: Track ONNX opset versions
2. **Validation**: Compare ONNX outputs with original model
3. **Profiling**: Use ONNX Runtime profiling tools
4. **Hardware-Specific Optimization**: Leverage execution providers
5. **Model Versioning**: Maintain model registry

## Conclusion

ONNX provides a robust framework for deploying ML models efficiently across diverse platforms. Its optimization capabilities and framework interoperability make it essential for production ML systems.

---

*For more on ML deployment and optimization, follow my research on efficient NLP systems.*
