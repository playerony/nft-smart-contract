import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('hero contract', () => {
  async function createHero() {
    const heroContract = await ethers.getContractFactory('Hero');
    const deployedHeroContract = await heroContract.deploy();
    await deployedHeroContract.deployed();

    return deployedHeroContract;
  }

  let hero;

  before(async () => {
    hero = await createHero();
  });

  it('should get zero heroes array', async () => {
    expect(await hero.getHeroes()).to.deep.equal([]);
  });

  it('should fail at creating hero because of not enought money', async () => {
    let error;

    try {
      await hero.createHero(0, { value: ethers.utils.parseEther('0.04') });
    } catch (err) {
      error = err;
    }

    expect(error.message.includes('Not enough ethers')).to.equal(true);
  });
});
