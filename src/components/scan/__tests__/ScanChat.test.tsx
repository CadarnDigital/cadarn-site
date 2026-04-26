import { act, render, screen } from '@testing-library/react';
import { ScanChat } from '../ScanChat';

const mockDoneReader = () => ({
  ok: true,
  body: {
    getReader: () => ({
      read: vi.fn().mockResolvedValue({ done: true, value: undefined }),
    }),
  },
});

const dispatchScanStart = (leadName = '') =>
  act(() => {
    window.dispatchEvent(new CustomEvent('scan-start', { detail: { leadName } }));
  });

describe('ScanChat', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue(mockDoneReader() as unknown as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when not started', () => {
    const { container } = render(<ScanChat />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the chat UI after scan-start event', async () => {
    render(<ScanChat leadName="Maria" />);
    await dispatchScanStart('Maria');
    expect(await screen.findByText(/scan de autoridade cadarn/i, { selector: 'span' })).toBeInTheDocument();
  });

  it('renders close button when onClose prop is provided', async () => {
    const onClose = vi.fn();
    render(<ScanChat onClose={onClose} />);
    await dispatchScanStart();
    expect(await screen.findByRole('button', { name: /fechar/i })).toBeInTheDocument();
  });

  it('does not render close button when onClose is absent', async () => {
    render(<ScanChat />);
    await dispatchScanStart();
    await screen.findByText(/scan de autoridade cadarn/i, { selector: 'span' });
    expect(screen.queryByRole('button', { name: /fechar/i })).not.toBeInTheDocument();
  });

  it('send button is disabled when input is empty', async () => {
    render(<ScanChat />);
    await dispatchScanStart();
    await screen.findByText(/scan de autoridade cadarn/i, { selector: 'span' });
    expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled();
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<ScanChat leadName="Teste" />);
    await dispatchScanStart('Teste');
    expect(await screen.findByText(/ocorreu um erro/i)).toBeInTheDocument();
  });
});
