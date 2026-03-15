# ========================================
# BACKEND DOCKERFILE
# ========================================

# Use uma imagem oficial do Python como base
FROM python:3.11

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o arquivo de requisitos primeiro 
COPY requirements.txt .

# Instala as dependências Python
RUN pip install -r requirements.txt

# Copia todo o código do backend
COPY . .
# Expõe a porta 8000
EXPOSE 8000

# Executa migrações, popula os dados iniciais e inicia o servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py populate_initial_data && python manage.py runserver 0.0.0.0:8000"]