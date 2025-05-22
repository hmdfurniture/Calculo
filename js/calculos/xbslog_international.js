function calcular_xbslog_international(destino, dimensoes, conversion) {
    let totalLdm = 0;
    let hasBox = false;
    let hasPallet = false;
    let allPalletsHaveHighHeight = true;
    let allLengthsValid = true;

    // Verifica tipos e restrições
    dimensoes.forEach(d => {
        const { type, length, height } = d;
        if (type === "box") {
            hasBox = true;
        } else if (type === "pallet") {
            hasPallet = true;
            if (height <= 125) allPalletsHaveHighHeight = false;
            if (length < 100 || length > 125) allLengthsValid = false;
        }
    });

    // Só calcula se todas as condições forem verdadeiras
    if (hasPallet && !hasBox && allPalletsHaveHighHeight) {
        if (!allLengthsValid) {
            return { erro: "Palete com o cumprimento fora de medida, não é possivel calcular!!!" };
        }

        // Calcula LDM conforme a regra
        dimensoes.forEach(d => {
            if (d.type === "pallet") {
                let adjustedLength = 120; // Força sempre 120cm se está no intervalo
                totalLdm += (d.width / 240) * (adjustedLength / 100) * d.quantity;
            }
        });

        if (totalLdm === 0) {
            return { erro: "Não é possível calcular: Nenhuma dimensão LDM válida." };
        }
        let totalWeight = totalLdm * (conversion?.LDM || 333);

        // Segue cálculo da tarifa e retorno (restante igual ao seu original...)
        const rates = destino?.rates;
        if (!rates) {
            return { erro: "Não existem tarifas para este destino internacional." };
        }

        const roundedWeight = Math.ceil(totalWeight / 100) * 100;
        const scaledWeight = roundedWeight / 100;
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

        let cost = scaledWeight * foundRate;
        cost = cost < rates.minimum ? rates.minimum : cost;

        return {
            transportadora: "XBS Internacional",
            totalLdm,
            totalCubicMeters: 0,
            totalWeight,
            scaledWeight,
            rateValue: foundRate,
            rateLabel: foundTier,
            cost,
            erro: null
        };
    } else {
        // Se não cumpre os critérios, retorna erro específico
        return { erro: "Para cálculo por LDM, insira apenas paletes com altura > 125cm e comprimento entre 100-125cm. Não pode haver caixas ou paletes baixas." };
    }
}
