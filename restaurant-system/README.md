# Sistema de Gestão de pedidos para um Restaurante

## Sobre o projeto

Sistema de gestão de pedidos para um Restaurante, desenvolvido como desafio técnico para a jeKnowledge. Permite aos clientes escolher uma mesa, escolher os pratos, ver o resumo do pedido e fazer o pedido. Permite ao "staff" da cozinha ver o estado de cada pedido e arrastá-lo para o estado correspondente.

**Nota**: Configurações apenas para ambiente de desenvolvimento local.

## Tecnologias Utilizadas

- Docker Compose 

### Backend

- Python 3.13
- Django 5.2.12
- Django REST Framework 3.16.1
- SQLite3

### Frontend
- React 19.2.4
- Sass 1.98
- Vite 8
- React Router 7.13.1

# Instalação (feita com docker)
1. **Clone o respositório e navegue até à pasta do projeto**:
    git clone https://github.com/costaaa2006/DesafioTech
    cd restarant-system

2. **Inicie os serviços**:
    docker compose up --build

#### Gestão de Volumes e Containers Docker (Comandos Úteis)

**Listar containers (Em execução e Parados)**:

docker ps -a

**Parar e remover containers**:

docker-compose down

# Instalação Local
1. **Clone o repositório e navegue até à pasta do projeto**:

    git clone https://github.com/costaaa2006/DesafioTech
    cd restaurant-system

#### Backend (Django)
1. **Navegue até à pasta do backend**:

    cd backend

2. **Crie um ambiente virtual**:

    python3 -m venv venv
    source venv/bin/activate

3. **Instale as dependências**:

    pip install -r requirements.txt

4. **Popule os dados**:

    python3 manage.py populate_inital_data

5. **Execute as migrações**:

    python manage.py migrate

#### Frontend (React + Vite)
1. **Abra um novo terminal e navegue até à pasta do frontend**:

    cd frontend

2. **Instale as dependências**:

    npm install

3. **Inicie o servidor de desenvolvimento**:
    npm run dev

## **Acesso às Interfaces Gráficas**:

- **Frontend**: http://localhost:5173
- **Backend API**: https://localhost:8000/api/