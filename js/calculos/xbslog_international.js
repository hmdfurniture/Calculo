function calcular_xbslog_international(destino, dimensoes, conversion) {
    let totalLdm = 0;
    let onlyPallets = true;
    let allPalletsHigh = true;
    let allLengthsValid = true;

    // Verifica condições para LDM
    dimensoes.forEach(d => {
        if (d.type !== "pallet") onlyPallets = false;
        if (d.type === "pallet") {
            if (d.height <= 125) allPalletsHigh = false;
            if (d.length < 100 || d.length > 125) allLengthsValid = false;
        }
    });

    // 1. Cálculo por LDM (caso especial)
    if (onlyPallets && allPalletsHigh) {
        if (!allLengthsValid) {
            return { erro: "Palete com o cumprimento fora de medida, não é possivel calcular!!!" };
        }

        dimensoes.forEach(d => {
            // Para cada palete, usar sempre comprimento 120
            let adjustedLength = 120;
            totalLdm += (d.width / 240) * (adjustedLength / 100) * d.quantity;
        });

        if (totalLdm === 0) {
            return { erro: "Não é possível calcular: Nenhuma dimensão LDM válida." };
        }
        let totalWeight = totalLdm * (conversion?.LDM || 333);

        // Busca tarifa
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
    }

    // 2. Cálculo por m3 (todas as outras situações)
    let totalCubicMeters = 0;
    dimensoes.forEach(d => {
        let adjustedHeight = d.height;
        // Se for palete alta (>125), força altura 250cm
        if (d.type === "pallet" && d.height > 125) {
            adjustedHeight = 250;
        }
        // Caixas e paletes baixas usam altura original
        let cubicMeters = (d.width * d.length * adjustedHeight) / 1000000;
        totalCubicMeters += cubicMeters * d.quantity;
    });

    if (totalCubicMeters === 0) {
        return { erro: "Por favor preencha as dimensões." };
    }

    let totalWeight = totalCubicMeters * (conversion?.m3 || 333);

    // Busca tarifa
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
        totalLdm: 0,
        totalCubicMeters,
        totalWeight,
        scaledWeight,
        rateValue: foundRate,
        rateLabel: foundTier,
        cost,
        erro: null
    };
}
