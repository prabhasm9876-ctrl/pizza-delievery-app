from app.db.database import SessionLocal, engine
from app.db.models.product import Restaurant, Items, Order, OrderItem
from app.db.models.user import User
from sqlalchemy import text

def inspect_database():
    db = SessionLocal()
    try:
        # Check tables
        print("Checking tables...")
        for model in [User, Restaurant, Items, Order, OrderItem]:
            count = db.query(model).count()
            print(f"{model.__name__}: {count} records")
            
        # If there are no restaurants, create a sample restaurant and some items
        if db.query(Restaurant).count() == 0:
            print("Creating sample restaurant and items...")
            restaurant = Restaurant(
                name="Pizza Point Central",
                description="The best artisanal pizzas in town, baked fresh in our brick oven.",
                location="123 Pizza Street, Food City"
            )
            db.add(restaurant)
            db.commit()
            db.refresh(restaurant)
            
            pizzas = [
                {"name": "Signature Margherita", "description": "Wood-fired crust, mozzarella, basil, and house tomato sauce.", "price": 14.99},
                {"name": "Pepperoni Blaze", "description": "Spicy pepperoni, smoked mozzarella, and a roasted garlic finish.", "price": 17.49},
                {"name": "Garden Delight", "description": "Roasted vegetables, pesto drizzle, and creamy burrata on a thin crust.", "price": 16.29},
                {"name": "BBQ Chicken Feast", "description": "Grilled chicken, smoky BBQ sauce, red onions, and fresh cilantro.", "price": 18.99},
                {"name": "Truffle Mushroom", "description": "Wild mushrooms, white truffle oil, mozzarella, and fresh arugula.", "price": 19.99},
                {"name": "Four Cheese Classic", "description": "Mozzarella, gorgonzola, parmesan, and ricotta with garlic oil.", "price": 15.99}
            ]
            
            for p in pizzas:
                item = Items(
                    restaurant_id=restaurant.restaurant_id,
                    name=p["name"],
                    description=p["description"],
                    price=p["price"]
                )
                db.add(item)
            db.commit()
            print("Successfully seeded database!")
            
    except Exception as e:
        print(f"Error during inspection: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_database()
