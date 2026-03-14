from django.core.management.base import BaseCommand
from api.models import Table, Category, Dish, Ingredient



class Command(BaseCommand):
    help = "Popula mesas, categorias e pratos iniciais"

    def handle(self, *args, **options):
        Dish.objects.all().delete()
        Category.objects.all().delete()
        Ingredient.objects.all().delete()
        Table.objects.all().delete()
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
            {"name": "Bruschetta", "description": "Fatias de pão crocante cobertas com tomate fresco temperado e manjericão.", "price": 2.50, "category": "Entradas","ingredients": ["Pão italiano", "Tomate", "Manjericão", "Azeite", "Alho", "Sal", "Pimenta"]},
            {"name": "Camarão ao Alho", "description": "Camarões suculentos salteados no alho e azeite, servidos com um toque de limão.", "price": 3.00, "category": "Entradas","ingredients": ["Camarões médios", "Alho", "Azeite", "Salsa", "Limão", "Sal", "Pimenta"]},
            {"name": "Salada Caprese", "description": "Salada fresca de tomate e mussarela, com manjericão e um fio de azeite.", "price": 3.00, "category": "Entradas","ingredients": ["Tomate", "Queijo Mozzarella", "Manjericão", "Azeite", "Vinagre balsâmico", "Sal", "Pimenta"]},

            {"name": "Sopa de Legumes", "description": "Sopa leve e nutritiva com legumes frescos cozidos lentamente para um sabor reconfortante.", "price": 5.00, "category": "Sopas","ingredients": ["Cenoura", "Batata", "Cebola", "Alho","Azeite", "Caldo de legumes", "Sal", "Pimenta"]},
            {"name": "Creme de Tomate", "description": "Creme suave de tomate com um toque de manjericão fresco, ideal para aquecer o paladar.", "price": 6.00, "category": "Sopas","ingredients": ["Tomate", "Cebola", "Alho","Azeite", "Creme de leite", "Sal", "Pimenta", "Manjericão"]},

            {"name": "Bife Grelhado com Ervas", "description": "Bife suculento grelhado com ervas aromáticas, perfeito para os amantes de carne.", "price": 12.50, "category": "Carne","ingredients": ["Bife de vaca","Alho","Alecrim","Tomilho", "Sal", "Pimenta"]},
            {"name": "Frango ao Curry", "description": "Frango macio cozido num molho cremoso de curry com um toque exótico.", "price": 11.50, "category": "Carne","ingredients": ["Peito de frango","Cebola","Alho","Leite de coco", "Curry em pó", "Azeite", "Sal","Pimenta"]},
            {"name": "Costeletas de Porco com Molho Barbecue", "description": "Costeletas suculentas assadas com molho barbecue caseiro, sabor intenso e defumado.", "price": 14.50, "category": "Carne","ingredients": ["Costeletas de porco","Molho Barbecue","Cebola","Alho", "Azeite", "Sal","Pimenta"]},

            {"name": "Salmão Grelhado com Limão", "description": "Salmão suculento grelhado, com um toque fresco de limão e ervas aromáticas.", "price": 14.00, "category": "Peixe","ingredients": ["Salmão", "Limão", "Alho", "Azeite", "Salsa", "Sal", "Pimenta"]},
            {"name": "Bacalhau à Brás", "description": "Tradicional prato português de bacalhau desfiado com ovos e batata, cremoso e saboroso.", "price": 12.50, "category": "Peixe","ingredients": ["Bacalhau", "Ovos", "Batata palha", "Azeite", "Cebola","Salsa", "Sal", "Pimenta"]},
            {"name": "Dourada Assada com Ervas", "description": "Dourada assada no forno com ervas frescas e limão, leve e delicioso.", "price": 13.00, "category": "Peixe","ingredients": ["Dourada", "Alecrim","Tomilho", "Limão", "Alho","Azeite", "Sal", "Pimenta"]},

            {"name": "Mousse de Chocolate", "description": "Mousse cremosa e leve de chocolate, perfeita para finalizar a refeição com doçura.", "price": 4.50, "category": "Sobremesa","ingredients": ["Chocolate", "Ovos","Açúcar", "Natas", "Baunilha"]},
            {"name": "Tiramisu", "description": "Clássico italiano com camadas de biscoito embebido em café e creme de mascarpone.", "price": 5.00, "category": "Sobremesa","ingredients": ["Biscoitos", "Ovos","Açúcar", "Cacau em pó", "Café", "Mascarpone"]},

        ]

        for prato in pratos:
            # Criar o prato sem ingredients
            dish, created = Dish.objects.get_or_create(
                name=prato["name"],
                description=prato["description"],
                price=prato["price"],
                category=categoria_objs[prato["category"]],
            )
            
            # Criar/pegar os ingredientes e associar ao prato
            ingredient_objs = []
            for ing_name in prato["ingredients"]:
                ing_obj, _ = Ingredient.objects.get_or_create(name=ing_name)
                ingredient_objs.append(ing_obj)
            
            dish.ingredients.set(ingredient_objs)

        self.stdout.write(self.style.SUCCESS("Mesas, categorias e pratos criados com sucesso!"))