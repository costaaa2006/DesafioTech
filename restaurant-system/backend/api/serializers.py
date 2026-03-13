# Transforma objetos Python do Django em JSON e vice-versa.
# Valida dados recebidos e cria/atualiza objetos do modelo com base nesses dados.

from .models import Category, Ingredient, Dish, Table, Order, OrderItem
from rest_framework import serializers

#--------------------------------------------
# Serializer para Ingredientes 
#--------------------------------------------

class IngredientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name']

#--------------------------------------------
# Serializer para Pratos
class DishSerializer(serializers.ModelSerializer):
#--------------------------------------------

    # Inclui a lista de ingredientes do prato
    ingredients = IngredientsSerializer(many=True, read_only=True)  

    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'category', 'ingredients']

#--------------------------------------------
# Serializer para Categorias
#--------------------------------------------

class CategorySerializer(serializers.ModelSerializer):

    # Inclui a lista de pratos da categoria
    dishes = DishSerializer(many=True, read_only=True) 

    class Meta:
        model = Category
        fields = ['id', 'name','dishes']

#--------------------------------------------
# Serializer para as mesas
#--------------------------------------------

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'number']

#--------------------------------------------
# Serializer para um item do pedido
#--------------------------------------------

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'dish', 'quantity']
        read_only_fields = ['order']

#--------------------------------------------
# Serializer para um pedido (cliente) - inclui summary
#--------------------------------------------

class OrderSerializer(serializers.ModelSerializer):

    # Inclui os itens do pedido
    items = OrderItemSerializer(many=True) 

    summary = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'table', 'status', 'created_at', 'updated_at', 'items','summary']
    
    # Função que cria um objeto na base de dados. Recebe os dados validados e cria um novo pedido. Se os dados incluírem itens de pedido, também cria os objetos OrderItem correspondentes.
    def create(self, validated_data):

        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
    
    def get_summary(self, obj):
        return obj.summary()  

#--------------------------------------------
# Serializer para um item do pedido (cozinha) - inclui nome do prato e quantidade
#--------------------------------------------
class KitchenOrderItemSerializer(serializers.ModelSerializer):

    dish = serializers.StringRelatedField()

    class Meta:
        model = OrderItem
        fields = ["dish", "quantity"]

#--------------------------------------------
# Serializer para um pedido (cozinha) - inclui número da mesa, status e itens do pedido
#--------------------------------------------
class KitchenOrderSerializer(serializers.ModelSerializer):

    items = KitchenOrderItemSerializer(many=True, read_only=True)
    table_number = serializers.IntegerField(source="table.number")
    summary = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id","table_number","status","created_at","items","summary"]
    
    def get_summary(self, obj):
        return [
            {
                "dish": item.dish.name,
                "quantity": item.quantity,
                "ingredients": [ingredient.name for ingredient in item.dish.ingredients.all()]
            }
            for item in obj.items.all()
        ]