from django.core.management.base import BaseCommand
from api.models import Table, Category, Dish

class Command(BaseCommand):
    help = "Popula mesas, categorias e pratos iniciais"

    def handle(self, *args, **options):
        # Mesas
        for i in range(1, 6):
            Table.objects.get_or_create(number=i)

        # Categorias
        categorias = ["Entradas", "Sopas", "Carne", "Peixe", "Sobremesa"]
        categoria_objs = {}
        for cat in categorias:
            obj, _ = Category.objects.get_or_create(name=cat)
            categoria_objs[cat] = obj

        # Pratos
        pratos = [
            {"name": "Bruschetta", "description": "Pão com tomate e manjericão", "price": 5.00, "category": "Entradas"},
            {"name": "Sopa de Legumes", "description": "Sopa quente de legumes", "price": 3.50, "category": "Sopas"},
            {"name": "Bife Grelhado", "description": "Bife de vaca grelhado", "price": 12.00, "category": "Carne"},
            {"name": "Salmão ao Forno", "description": "Salmão fresco com ervas", "price": 15.00, "category": "Peixe"},
            {"name": "Mousse de Chocolate", "description": "Sobremesa de chocolate cremosa", "price": 6.00, "category": "Sobremesa"},
        ]

        for prato in pratos:
            Dish.objects.get_or_create(
                name=prato["name"],
                description=prato["description"],
                price=prato["price"],
                category=categoria_objs[prato["category"]]
            )

        self.stdout.write(self.style.SUCCESS("Mesas, categorias e pratos criados com sucesso!"))