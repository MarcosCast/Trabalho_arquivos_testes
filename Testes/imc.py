def calcular_imc(peso, altura):
    # Fórmula do IMC: peso (kg) / (altura (m) ^ 2)
    imc = peso / (altura ** 2)
    return imc

def categoria_imc(imc):
    if imc < 18.5:
        return "Abaixo do peso"
    elif 18.5 <= imc < 24.9:
        return "Peso normal"
    elif 25 <= imc < 29.9:
        return "Sobrepeso"
    elif 30 <= imc < 34.9:
        return "Obesidade grau 1"
    elif 35 <= imc < 39.9:
        return "Obesidade grau 2"
    else:
        return "Obesidade grau 3"

def main():
    try:
        peso = float(input("Digite o peso em kg: "))
        altura = float(input("Digite a altura em metros: "))
        
        imc = calcular_imc(peso, altura)
        categoria = categoria_imc(imc)
        
        print(f"Seu IMC é: {imc:.2f}")
        print(f"Categoria: {categoria}")
    except ValueError:
        print("Erro: Certifique-se de que você digitou números válidos para peso e altura.")

if __name__ == "__main__":
    main()

