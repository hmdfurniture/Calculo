function calcular_teste(destino, dimensoes, conversion) {
    let totalCubicMeters = 0;
    let totalLdm = 0;
    let hasBox = false;
    let hasPallet = false;
    let allPalletsHaveLowHeight = true;
    let allPalletsHaveHighHeight = true;
    let allLengthsValid = true;

    dimensoes.forEach(d => {
        const { type, width, length, height, quantity } = d;
        if (type === "box") {
            hasBox = true;
        } else if (type === "pallet") {
            hasPallet = true;
            if (height > 125) {
                allPalletsHaveLowHeight = false;
                if (length < 100 || length > 125) allLengthsValid = false;
            } else {
                allPalletsHaveHighHeight = false;
            }
        }
    });

    let totalWeight, scaledWeight, rates, cost, rateValue, rateLabel;

    if (hasPallet && !hasBox && allPalletsHaveHighHeight && allLengthsValid) {
        dimensoes.forEach(d => {
            const { type, width, length, quantity } = d;
            if (type === "pallet") {
                let adjustedLength = (length >= 100 && length <= 125) ? 120 : length; // Correção aplicada
                totalLdm += (width / 240) * (adjustedLength / 100) * quantity;
            }
        });

        if (totalLdm === 0) {
            return { erro: "Não é possível calcular: Nenhuma dimensão LDM válida." };
        }
        totalWeight = totalLdm * (conversion?.LDM || 333);
    } else {
        dimensoes.forEach(d => {
            const { type, width, length, height, quantity } = d;
            let adjustedHeight = height > 125 ? 250 : height; // Correção aplicada
            let adjustedLength = length; // Definição corrigida

            let cubicMeters = (width * adjustedLength * adjustedHeight) / 1000000;
            totalCubicMeters += cubicMeters * quantity;
        });

        if (totalCubicMeters === 0) {
            return { erro: "Por favor preencha as dimensões." };
        }
        totalWeight = totalCubicMeters * (conversion?.m3 || 333);
    }

    rates = destino?.rates;
    if (!rates) {
        return { erro: "Não existem tarifas para este destino (tabela teste)." };
    }

    // Exemplo de tiers tipo "<100", ">500", etc.
    const roundedWeight = Math.ceil(totalWeight / 100) * 100;
    scaledWeight = roundedWeight / 100;

    // Procura escalão adequado
    let foundTier = null;
    let foundRate = null;
    Object.keys(rates).forEach(tier => {
        if (tier.startsWith("<")) {
            const max = parseInt(tier.slice(1), 10);
            if (totalWeight <= max && !foundTier) {
                foundTier = tier;
                foundRate = rates[tier];
            }
        } else if (tier.startsWith(">")) {
            const min = parseInt(tier.slice(1), 10);
            if (totalWeight > min && !foundTier) {
                foundTier = tier;
                foundRate = rates[tier];
            }
        }
    });

    if (!foundTier) foundTier = "minimum";
    if (foundRate === null) foundRate = rates[foundTier] || 0;

    cost = scaledWeight * foundRate;
    cost = cost < rates.minimum ? rates.minimum : cost;

    return {
        transportadora: "Tabela Teste",
        totalLdm,
        totalCubicMeters,
        totalWeight,
        scaledWeight,
        rateValue: foundRate,
        rateLabel: foundTier,
        cost,
        erro: null
    };
}
