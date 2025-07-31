import React, { useState } from 'react';
import { Form, Button, Row, Col, Image, ListGroup } from 'react-bootstrap'; // Importe componentes do React-Bootstrap
import Message from '../components/Message'; // Componente de mensagem genérico (opcional, mas bom ter)
import Loader from '../components/Loader'; // Componente de loading (opcional, mas bom ter)

// Este é um componente mock para simular o upload de arquivo.
// Em um ambiente real, você faria um upload para um serviço de armazenamento como Cloudinary ou S3
// e obteria a URL da imagem.
const FileUploadInput = ({ onFileChange }) => {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onFileChange(reader.result); // Passa a URL da imagem temporária
            };
            reader.readAsDataURL(file); // Lê o arquivo como Data URL para pré-visualização
        }
    };

    return (
        <Form.Group controlId="imageUpload" className="mb-3">
            <Form.Label>Upload da Foto do Rosto do Cliente</Form.Label>
            <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                required 
            />
        </Form.Group>
    );
};

const ClientsScreen = () => {
    // Estados para o formulário
    const [clientName, setClientName] = useState('');
    const [originalPhoto, setOriginalPhoto] = useState(null); // URL da imagem para pré-visualização
    const [faceShape, setFaceShape] = useState('');
    const [hairType, setHairType] = useState('');
    const [hasBeard, setHasBeard] = useState('');
    const [preferredStyle, setPreferredStyle] = useState('');

    // Estados para a geração da IA
    const [generatedImage, setGeneratedImage] = useState(null);
    const [tokensUsed, setTokensUsed] = useState(null);
    const [cost, setCost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Estado para o histórico (mock de dados)
    const [history, setHistory] = useState([
        { id: 1, client: 'João Silva', date: '2025-07-29', tokens: 980, cost: 0.18, imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Antigo+Joao' },
        { id: 2, client: 'Maria Oliveira', date: '2025-07-28', tokens: 1120, cost: 0.21, imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Antiga+Maria' },
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        // Validação básica
        if (!originalPhoto || !clientName || !faceShape || !hairType || !hasBeard || !preferredStyle) {
            setError('Por favor, preencha todos os campos e faça o upload da foto.');
            setLoading(false);
            return;
        }

        // --- Simulação da chamada da API de IA ---
        // Em um cenário real, você faria uma requisição POST para seu backend,
        // enviando originalPhoto (talvez como FormData ou a URL após upload para S3/Cloudinary),
        // clientName, faceShape, hairType, hasBeard, preferredStyle.
        // O backend então chamaria a API da IA (DALL-E, SDXL, etc.) e retornaria os dados.

        try {
            // Mock de uma requisição assíncrona
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay da API

            // Dados de mock para a resposta da IA
            const mockResponse = {
                imageUrl: 'https://via.placeholder.com/300/00FF00/FFFFFF?text=Visage+IA', // Imagem de exemplo
                tokensUsed: Math.floor(Math.random() * (2000 - 500 + 1)) + 500, // Tokens aleatórios
                cost: (Math.random() * (0.50 - 0.10) + 0.10).toFixed(2), // Custo aleatório
            };

            setGeneratedImage(mockResponse.imageUrl);
            setTokensUsed(mockResponse.tokensUsed);
            setCost(mockResponse.cost);
            setMessage('Visual gerado com sucesso!');

            // Adiciona ao histórico (para o MVP, apenas no estado local)
            setHistory(prevHistory => [
                {
                    id: prevHistory.length + 1,
                    client: clientName,
                    date: new Date().toLocaleDateString('pt-BR'),
                    tokens: mockResponse.tokensUsed,
                    cost: mockResponse.cost,
                    imageUrl: mockResponse.imageUrl,
                },
                ...prevHistory, // Adiciona o novo item no topo
            ]);

            // Limpa o formulário após a geração (opcional)
            // setClientName('');
            // setOriginalPhoto(null);
            // setFaceShape('');
            // setHairType('');
            // setHasBeard('');
            // setPreferredStyle('');

        } catch (err) {
            // console.error('Erro ao gerar imagem:', err);
            setError('Erro ao gerar o visual. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Visagismo com IA para Clientes</h1>
            <hr />

            {error && <Message variant="danger">{error}</Message>}
            {message && <Message variant="success">{message}</Message>}
            {loading && <Loader />}

            <Row className="justify-content-md-center">
                <Col md={8} lg={7}>
                    <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white mb-4">
                        <h3 className="mb-4">Dados do Cliente e Preferências</h3>

                        <Form.Group controlId="clientName" className="mb-3">
                            <Form.Label>Nome do Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome do cliente"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <FileUploadInput onFileChange={setOriginalPhoto} />

                        {originalPhoto && (
                            <div className="mb-3 text-center">
                                <Form.Label>Pré-visualização da Foto Original:</Form.Label>
                                <Image src={originalPhoto} alt="Foto Original do Cliente" fluid rounded style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
                            </div>
                        )}

                        <Form.Group controlId="faceShape" className="mb-3">
                            <Form.Label>Formato do Rosto</Form.Label>
                            <Form.Select
                                value={faceShape}
                                onChange={(e) => setFaceShape(e.target.value)}
                                required
                            >
                                <option value="">Selecione o formato do rosto...</option>
                                <option value="oval">Oval</option>
                                <option value="redondo">Redondo</option>
                                <option value="quadrado">Quadrado</option>
                                <option value="triangular">Triangular</option>
                                <option value="coração">Coração</option>
                                <option value="diamante">Diamante</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="hairType" className="mb-3">
                            <Form.Label>Tipo de Cabelo Desejado</Form.Label>
                            <Form.Select
                                value={hairType}
                                onChange={(e) => setHairType(e.target.value)}
                                required
                            >
                                <option value="">Selecione o tipo de cabelo...</option>
                                <option value="curto">Curto</option>
                                <option value="degrade">Degradê</option>
                                <option value="crespo">Crespo</option>
                                <option value="longo">Longo</option>
                                <option value="social">Social</option>
                                <option value="undercut">Undercut</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="hasBeard" className="mb-3">
                            <Form.Label>O cliente quer barba?</Form.Label>
                            <Form.Select
                                value={hasBeard}
                                onChange={(e) => setHasBeard(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma opção...</option>
                                <option value="sim">Sim, quer barba</option>
                                <option value="nao">Não, sem barba</option>
                                <option value="cavanhaque">Cavanhaque</option>
                                <option value="cheia">Barba cheia</option>
                                <option value="desenhada">Barba desenhada</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="preferredStyle" className="mb-4">
                            <Form.Label>Estilo Preferido</Form.Label>
                            <Form.Select
                                value={preferredStyle}
                                onChange={(e) => setPreferredStyle(e.target.value)}
                                required
                            >
                                <option value="">Selecione o estilo...</option>
                                <option value="classico">Clássico</option>
                                <option value="moderno">Moderno</option>
                                <option value="ousado">Ousado</option>
                                <option value="esportivo">Esportivo</option>
                                <option value="casual">Casual</option>
                            </Form.Select>
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                            {loading ? 'Gerando...' : 'Gerar Visual com IA'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Seção de Imagem Gerada e Custos */}
            {generatedImage && (
                <Row className="justify-content-md-center mt-4">
                    <Col md={8} lg={7}>
                        <div className="p-4 border rounded shadow-sm bg-white text-center">
                            <h3 className="mb-3">Visual Gerado com IA</h3>
                            <Image src={generatedImage} alt="Visual Gerado pela IA" fluid rounded className="mb-3" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }} />
                            <p className="lead mb-1">
                                **Tokens usados:** {tokensUsed}
                            </p>
                            <p className="lead mb-0">
                                **Custo estimado:** R$ {cost}
                            </p>
                        </div>
                    </Col>
                </Row>
            )}

            {/* Seção de Histórico */}
            <Row className="justify-content-md-center mt-5">
                <Col md={10} lg={9}>
                    <div className="p-4 border rounded shadow-sm bg-white">
                        <h3 className="mb-4">Histórico de Imagens Geradas</h3>
                        {history.length === 0 ? (
                            <Message variant="info">Nenhum histórico de geração ainda.</Message>
                        ) : (
                            <ListGroup variant="flush">
                                {history.map((item) => (
                                    <ListGroup.Item key={item.id} className="d-flex align-items-center">
                                        <div className="me-3">
                                            <Image src={item.imageUrl} alt={`Cliente ${item.client}`} thumbnail style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <strong>{item.client}</strong> - {item.date}
                                            <br />
                                            Tokens: {item.tokens} - Custo: R$ {item.cost}
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ClientsScreen;