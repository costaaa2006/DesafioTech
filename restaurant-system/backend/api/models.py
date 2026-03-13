# Define os modelos de dados para o sistema do restaurante. 

from django.db import models

# Categoria dos pratos (Entradas, Pratos Principais, Sobremesas, etc.)
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Ingredientes dos pratos
class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Pratos do menu
class Dish(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=4, decimal_places=2)

    # Cada prato pertence a uma categoria. 'dishes' é o nome da relação inversa, permitindo aceder os pratos de uma categoria usando category.dishes.all(). on_delete=models.CASCADE significa que se uma categoria for apagada, todos os pratos associados a ela também o serão.
    category = models.ForeignKey(Category, related_name='dishes', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

# Mesa associada a cada pedido
class Table(models.Model):
    number = models.IntegerField(unique=True)

    def __str__(self):
        return f'Table {self.number}'

# Pedido associado a uma mesa. NOTA: Cada pedido pode ter múltiplos pedidos, mas cada pedido pertence a apenas uma mesa.
class Order(models.Model):
    STATUS_CHOICES = [
        ('OR', 'Ordered'),
        ('PR', 'Preparing'),
        ('CD', 'Cooling Down'),
        ('RS', 'Ready to Serve'),
        ('CO', 'Completed'),
    ]

    table = models.ForeignKey(Table, related_name='orders', on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='OR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Order {self.id} at Table {self.table.number} - Status: {self.status}'
    
    def summary(self):
        return [
            {'dish': item.dish.name, 
            'quantity': item.quantity, 
            'price': item.dish.price,
            'ingredients': [ingredient.name for ingredient in item.dish.ingredients.all()],
            'table': item.order.table.number} for item in self.items.all()
            ]


# Item do pedido
class OrderItem(models.Model):
    # Indica a qual pedido completo esse item pertence.
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.quantity} x {self.dish.name} - Order {self.order.id}'

