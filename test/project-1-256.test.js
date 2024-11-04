import { html, fixture, expect } from '@open-wc/testing';
import "../project-1-256.js";

describe("Project1256 test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <project-1-256
        title="title"
      ></project-1-256>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
