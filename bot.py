import discord
from discord.ext import commands

# 1. Konfiguracja uprawnień (Intents)
# Discord wymaga jasnego określenia, do jakich danych bot ma mieć dostęp.
intents = discord.Intents.default()
intents.message_content = True  # Wymagane, aby bot mógł czytać treść wiadomości

# 2. Inicjalizacja bota
# Definiujemy prefix (np. !ping) oraz przekazujemy uprawnienia
bot = commands.Bot(command_prefix="!", intents=intents)


# 3. Zdarzenie (Event) - Uruchomienie bota
@bot.event
async def on_ready():
    print(f"Zalogowano pomyślnie jako: {bot.user.name}")
    print(f"ID bota: {bot.user.id}")
    print("------")


# 4. Prosta komenda tekstowa
# Reaguje na: !ping
@bot.command()
async def ping(ctx):
    """Odpowiada klasycznym 'Pong!'"""
    await ctx.send("Pong! 🏓")


# 5. Komenda z argumentem
# Reaguje na: !echo [tekst]
@bot.command()
async def echo(ctx, *, arg):
    """Powtarza tekst wpisany przez użytkownika"""
    await ctx.send(arg)


# 6. Uruchomienie bota za pomocą tokenu
# PAMIĘTAJ: Nigdy nie podawaj nikomu swojego tokenu!
TOKEN = "MTUwOTY5MDAyNjY2NDAwMTY2Ng.GVsMvm.0QVnFSYi98rtujnAkN0aHZZY8tfjE4rjFCLYuE"
bot.run(TOKEN)
