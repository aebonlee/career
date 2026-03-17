import { useState, useRef } from 'react';
import { cn } from '../../utils';

export default function FileUpload({ onFileSelect, accept = '.pdf,.doc,.docx', maxSize = 10, label = '파일 업로드' }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }
    setError('');
    setFileName(file.name);
    onFileSelect?.(file);
  };

  return (
    <div>
      <div
        className={cn('file-upload', dragActive && 'file-upload--dragging')}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={e => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <div className="file-upload__icon">📎</div>
        <p className="file-upload__text">{label}</p>
        <p className="file-upload__hint">
          드래그하거나 클릭하여 파일을 선택하세요 (최대 {maxSize}MB)
        </p>
        {fileName && <p style={{ marginTop: 12, fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>{fileName}</p>}
        <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])} />
      </div>
      {error && <p className="form-error" style={{ marginTop: 8 }}>{error}</p>}
    </div>
  );
}
