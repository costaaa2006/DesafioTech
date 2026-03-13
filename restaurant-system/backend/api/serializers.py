# Transforma objetos Python do Django em JSON e vice-versa.
# Valida dados recebidos e cria/atualiza objetos do modelo com base nesses dados.

from .models import Category, Ingredient, Dish, Table, Order, OrderItem
from rest_framework import serializers

# Serializer para Ingredientes 
class IngredientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name']

# Serializer para Pratos
class DishSerializer(serializers.ModelSerializer):

    # Inclui a lista de ingredientes do prato
    ingredients = IngredientsSerializer(many=True, read_only=True)  

    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'category', 'ingredients']

# Serializer para Categorias
class CategorySerializer(serializers.ModelSerializer):

    # Inclui a lista de pratos da categoria
    dishes = DishSerializer(many=True, read_only=True) 

    class Meta:
        model = Category
        fields = ['id', 'name','dishes']

# Serializer para as mesas
class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'number']

# Serializer para um item do pedido
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'dish', 'quantity']
        read_only_fields = ['order']

class OrderSerializer(serializers.ModelSerializer):

    # Inclui os itens do pedido
    items = OrderItemSerializer(many=True) 

    class Meta:
        model = Order
        fields = ['id', 'table', 'status', 'created_at', 'updated_at', 'items']
    
    # Função que cria um objeto na base de dados. Recebe os dados validados e cria um novo pedido. Se os dados incluírem itens de pedido, também cria os objetos OrderItem correspondentes.
    def create(self, validated_data):

        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

