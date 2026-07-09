import { useState } from 'react';
import { useVideoAnalysis, AnalysisProgress, ClipsTimeline } from '@primate-intelligence/vision-react';

export function App() {
  const { run, cancel, reset, status, uploadStatus, analysis, error } = useVideoAnalysis();
  const [prompt, setPrompt] = useState('Is there a person in this video?');
  const [file, setFile] = useState<File | null>(null);

  const busy = uploadStatus === 'uploading' || status === 'running';

  return (
    <main>
      <h1>Primate Vision — reference client</h1>
      <p>
        Upload a video (mp4/mov), ask a yes/no question, get an answer with
        confidence and clip timestamps. Built on{' '}
        <code>@primate-intelligence/vision-react</code> + the public API v1.
      </p>

      <label>
        Question
        <input
          style={{ display: 'block', width: '100%', padding: 8, margin: '4px 0 12px' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={busy}
        />
      </label>

      <input
        type="file"
        accept="video/mp4,video/quicktime"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        disabled={busy}
      />

      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <button disabled={!file || !prompt || busy} onClick={() => file && void run(file, prompt)}>
          {busy ? 'Analyzing…' : 'Analyze'}
        </button>
        {status === 'running' && <button onClick={() => void cancel()}>Cancel</button>}
        {(status === 'completed' || status === 'failed' || status === 'error') && (
          <button onClick={reset}>Reset</button>
        )}
      </div>

      {uploadStatus === 'uploading' && <p>Uploading…</p>}
      <AnalysisProgress analysis={analysis} />

      {status === 'completed' && analysis?.result && (
        <section>
          <h2>
            {analysis.result.answer.toUpperCase()}{' '}
            <small>({Math.round(analysis.result.confidence * 100)}% confidence)</small>
          </h2>
          {analysis.narrative?.text && <p>{analysis.narrative.text}</p>}
          <ClipsTimeline
            result={analysis.result}
            onClipClick={(clip) => alert(`Clip: ${clip.start_s.toFixed(1)}s → ${clip.end_s.toFixed(1)}s`)}
          />
          <details style={{ marginTop: 12 }}>
            <summary>Raw result</summary>
            <pre>{JSON.stringify(analysis.result, null, 2)}</pre>
          </details>
        </section>
      )}

      {status === 'failed' && <p role="alert">Analysis failed: {analysis?.error?.message ?? 'unknown error'}</p>}
      {status === 'error' && <p role="alert">Error: {error?.message}</p>}
    </main>
  );
}
