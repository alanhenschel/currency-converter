# Unit Tests - Currency Converter

This directory contains isolated unit tests for all application layers.

## Estrutura dos Testes

```
tests/
├── conftest.py                    # Configurações e fixtures comuns
├── api/                          # Testes da camada de API (endpoints)
│   ├── test_conversion_api.py    # Testes do endpoint de conversão
│   └── test_transactions_api.py  # Testes do endpoint de transações
├── service/                      # Testes da camada de serviços
│   ├── test_conversion_service.py   # Testes do serviço de conversão
│   └── test_transaction_service.py  # Testes do serviço de transações
├── repository/                   # Testes da camada de repositório
│   └── test_transaction_repository.py  # Testes do repositório
└── external/                     # Testes de APIs externas (mockadas)
    └── test_currency_api.py      # Testes da API de câmbio externa
```

## Características dos Testes

### ✅ **Testes Unitários Isolados**
- Cada teste testa apenas uma unidade (classe/método) por vez
- Todas as dependências são mockadas usando `unittest.mock`
- Não há acesso real a banco de dados ou APIs externas

### ✅ **Cobertura Completa**
- **API Layer**: Testa todos os endpoints, códigos de status, validações e tratamento de erros
- **Service Layer**: Testa lógica de negócio, validações e tratamento de exceções
- **Repository Layer**: Testa operações de banco de dados com mocks do SQLAlchemy
- **External APIs**: Testa integração com APIs externas usando mocks de requisições HTTP

### ✅ **Mocks Apropriados**
- APIs externas são mockadas para evitar chamadas reais
- Banco de dados é mockado para evitar dependências
- Todas as dependências são injetadas via mocks

## Como Executar os Testes

### Executar Todos os Testes
```bash
# Na raiz do projeto
pytest tests/ -v
```

### Executar Testes por Camada
```bash
# Testes de API
pytest tests/api/ -v

# Testes de Serviços
pytest tests/service/ -v

# Testes de Repositório
pytest tests/repository/ -v

# Testes de APIs Externas
pytest tests/external/ -v
```

### Executar Teste Específico
```bash
# Teste específico
pytest tests/api/test_conversion_api.py::TestConversionAPI::test_convert_currency_success -v

# Classe de teste específica
pytest tests/service/test_conversion_service.py::TestConversionService -v
```

### Executar com Cobertura
```bash
# Instalar coverage se não tiver
pip install pytest-cov

# Executar com cobertura
pytest tests/ --cov=currency_converter --cov-report=html --cov-report=term-missing -v
```

## Cenários de Teste Cobertos

### API Layer (`tests/api/`)
- ✅ Conversão bem-sucedida de moeda
- ✅ Validação de entrada (campos obrigatórios, tipos, valores)
- ✅ Tratamento de erros de validação (422)
- ✅ Tratamento de erros de negócio (400, 404)
- ✅ Tratamento de erros internos (500)
- ✅ Busca de transações por usuário
- ✅ Casos edge (lista vazia, usuário inexistente)

### Service Layer (`tests/service/`)
- ✅ Lógica de conversão de moeda
- ✅ Cálculos de taxa de câmbio
- ✅ Validação de regras de negócio
- ✅ Gravação de transações
- ✅ Busca de histórico de transações
- ✅ Tratamento de erros de APIs externas
- ✅ Tratamento de erros de banco de dados

### Repository Layer (`tests/repository/`)
- ✅ Operações CRUD do SQLAlchemy
- ✅ Mapeamento entre modelos de domínio e ORM
- ✅ Tratamento de erros de banco de dados
- ✅ Queries com filtros
- ✅ Transações de banco de dados (commit, rollback)

### External APIs (`tests/external/`)
- ✅ Chamadas HTTP bem-sucedidas
- ✅ Tratamento de timeouts
- ✅ Tratamento de erros de conexão
- ✅ Validação de respostas da API
- ✅ Tratamento de respostas malformadas
- ✅ Códigos de erro específicos da API

## Boas Práticas Implementadas

### 🎯 **Isolamento**
- Cada teste é independente e pode rodar sozinho
- Mocks são resetados entre testes
- Não há efeitos colaterais entre testes

### 🎯 **Arrange-Act-Assert (AAA)**
- Todos os testes seguem o padrão AAA
- Setup claro dos dados de teste
- Ação específica sendo testada
- Verificações explícitas dos resultados

### 🎯 **Nomes Descritivos**
- Nomes de testes explicam o cenário e expectativa
- Classes de teste agrupam funcionalidades relacionadas
- Comentários explicam cenários complexos

### 🎯 **Fixtures Reutilizáveis**
- `conftest.py` contém fixtures comuns
- Factory methods para criar dados de teste
- Mocks padronizados para dependências

### 🎯 **Cobertura de Erros**
- Todos os tipos de exceção são testados
- Cenários de falha são cobertos
- Validações de entrada são testadas

## Dependências de Teste

```toml
[tool.poetry.group.test.dependencies]
pytest = "^7.4.0"
pytest-cov = "^4.1.0"
pytest-mock = "^3.11.1"
```

## Configuração de IDE

### VS Code
Adicione ao `.vscode/settings.json`:
```json
{
    "python.testing.pytestEnabled": true,
    "python.testing.pytestArgs": [
        "tests"
    ],
    "python.testing.unittestEnabled": false
}
```

## Executar Testes em CI/CD

Os testes são configurados para rodar automaticamente no GitHub Actions:

```yaml
- name: Run tests
  run: |
    pytest tests/ -v --cov=currency_converter --cov-report=xml
```

## Troubleshooting

### Problema: ImportError
```bash
# Instalar o projeto em modo desenvolvimento
pip install -e .
```

### Problema: Módulo não encontrado
```bash
# Verificar se está na raiz do projeto
pwd
# Verificar se o PYTHONPATH inclui o diretório atual
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Problema: Testes lentos
```bash
# Executar apenas testes rápidos (com tag)
pytest tests/ -m "not slow" -v
```
